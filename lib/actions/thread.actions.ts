"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import Thread from "../models/thread.model";
import Community from "../models/community.model";

export async function createThread({
  text,
  author,
  communityId,
  path,
}: {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}) {
  try {
    connectToDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdThread = await Thread.create({
      text,
      author,
      community: communityIdObject,
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { threads: createdThread._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}

export async function fetchThreads({
  pageNumber,
  pageSize,
}: {
  pageNumber: number;
  pageSize: number;
}) {
  connectToDB();

  const skipAmount = (pageNumber - 1) * pageSize;

  // fetch threads that have no parents (top-level threads)
  const threadsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    })
    .populate({
      path: "likedBy",
      model: User,
      select: "_id id",
    });

  const totalThreadsCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  const threads = await threadsQuery.exec();

  const hasNext = totalThreadsCount > skipAmount + threads.length;

  return { threads, hasNext };
}

async function fetchAllChildThreads(threadId: string): Promise<any[]> {
  const childThreads = await Thread.find({ parentId: threadId });

  const descendantThreads = [];
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread._id);
    descendantThreads.push(childThread, ...descendants);
  }

  return descendantThreads;
}

export async function deleteThread(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // Find the thread to be deleted (the main thread)
    const mainThread = await Thread.findById(id).populate("author community");

    if (!mainThread) {
      throw new Error("Thread not found");
    }

    // Fetch all child threads and their descendants recursively
    const descendantThreads = await fetchAllChildThreads(id);

    // Get all descendant thread IDs including the main thread ID and child thread IDs
    const descendantThreadIds = [
      id,
      ...descendantThreads.map((thread) => thread._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child threads and their descendants
    await Thread.deleteMany({ _id: { $in: descendantThreadIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}

export async function fetchThreadById(threadId: string) {
  connectToDB();

  try {
    const thread = await Thread.findById(threadId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      })
      .populate({
        path: "likedBy",
        model: User,
        select: "_id id",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
          {
            path: "likedBy",
            model: User,
            select: "_id id",
          },
        ],
      })
      .exec();

    return thread;
  } catch (err) {
    console.error("Error while fetching thread:", err);
    throw new Error("Unable to fetch thread");
  }
}

export async function addCommentToThread({
  threadId,
  commentText,
  userId,
  path,
}: {
  threadId: string;
  commentText: string;
  userId: string;
  path: string;
}) {
  connectToDB();

  try {
    // Find the original thread by its ID
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error("Thread not found");
    }

    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    // Save the comment thread to the database
    const savedCommentThread = await commentThread.save();

    // Add the comment thread's ID to the original thread's children array
    originalThread.children.push(savedCommentThread._id);

    // Save the updated original thread to the database
    await originalThread.save();

    revalidatePath(path);
  } catch (err) {
    console.error("Error while adding comment:", err);
    throw new Error("Unable to add comment");
  }
}

export async function likeThread(threadId: string, userId: string) {
  try {
    connectToDB();

    // Find the thread by its unique id
    const thread = await Thread.findOne({ _id: threadId });

    if (!thread) {
      throw new Error("Thread not found");
    }

    // Find the user by their unique id
    const user = await User.findOne({ id: userId });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if the user is already a member of the community
    if (thread.likedBy.includes(user._id)) {
      throw new Error("User already liked the thread");
    }

    // Add the user's _id to the likedBy array in the thread
    thread.likedBy.push(user._id);
    await thread.save();

    return { success: true };
  } catch (err) {
    console.error("Error while liking thread:", err);
    throw new Error("Unable to like thread");
  }
}

export async function removeLikeFromThread(threadId: string, userId: string) {
  try {
    connectToDB();

    const userIdObject = await User.findOne({ id: userId }, { _id: 1 });

    if (!userIdObject) {
      throw new Error("User not found");
    }

    const threadIdObject = await Thread.findOne({ _id: threadId }, { _id: 1 });

    if (!threadIdObject) {
      throw new Error("Thread not found");
    }

    // Remove the user's _id from the likedBy array in the thread
    await Thread.updateOne(
      { _id: threadIdObject._id },
      { $pull: { likedBy: userIdObject._id } }
    );

    return { success: true };
  } catch (err) {
    console.error("Error while removing like from thread:", err);
    throw new Error("Unable to remove like from thread");
  }
}
