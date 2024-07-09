"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";
import Community from "../models/community.model";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
  connectToDB();

  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      {
        upsert: true, // update if exists, else insert
      }
    );

    if (path === "profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId }).populate({
      path: "communities",
      model: Community,
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString.trim(), "i");

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = {
      createdAt: sortBy,
    };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    const hasNext = totalUsersCount > skipAmount + users.length;

    return { users, hasNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
}

export async function fetchUserThreads(userId: string) {
  try {
    connectToDB();

    // Find all threads authored by the user
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      options: { sort: { createdAt: "desc" } },
      populate: [
        {
          path: "community",
          model: Community,
          select: "_id id name image",
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "id name image",
          },
        },
        {
          path: "likedBy",
          model: User,
          select: "_id id",
        },
      ],
    });

    return threads;
  } catch (error: any) {
    throw new Error(`Failed to fetch user threads: ${error.message}`);
  }
}

export async function fetchUserReplies(userId: string) {
  try {
    connectToDB();

    // Find all threads authored by the user
    const user = await User.findOne({ id: userId });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const threads = await Thread.find({
      author: user._id,
      parentId: { $ne: null },
    })
      .sort({ createdAt: "desc" })
      .populate({
        path: "author",
        model: User,
        select: "id name image",
      })
      .populate({
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "id name image",
        },
      })
      .populate({
        path: "likedBy",
        model: User,
        select: "_id id",
      });

    return threads;
  } catch (error: any) {
    throw new Error(`Failed to fetch user threads: ${error.message}`);
  }
}

export async function fetchActivities(userId: string) {
  try {
    connectToDB();

    // Find all threads authored by the user
    const userThreads = await Thread.find({ author: userId });

    // Find all comments' IDs from the user's threads
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    // Find all comments from the user's threads except for the user's own comments
    const comments = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({ path: "author", model: User, select: "_id name image" });

    // Find all replies made by the user
    const userReplies = await Thread.find({
      author: userId,
      parentId: { $ne: null },
    })
      .sort({ createdAt: "desc" })
      .populate({
        path: "author",
        model: User,
        select: "_id name image",
      })
      .populate({
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "_id name image",
        },
      });

    // Gather all children of the user's replies
    const replyThreadIds = userReplies.reduce((acc, reply) => {
      return acc.concat(reply.children);
    }, []);

    const repliesToUserReplies = await Thread.find({
      _id: { $in: replyThreadIds },
      author: { $ne: userId },
    }).populate({ path: "author", model: User, select: "_id name image" });

    // Combine comments and replies with a type property and remove duplicates
    const activities = [
      ...comments.map((comment) => ({
        ...comment.toObject(),
        type: "comment",
      })),
      ...repliesToUserReplies.map((reply) => ({
        ...reply.toObject(),
        type: "reply",
      })),
    ];

    // Remove duplicates based on thread ID
    const uniqueActivities = Array.from(
      new Map(
        activities.map((activity) => [activity._id.toString(), activity])
      ).values()
    );

    // Sort by time
    uniqueActivities.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));

    return uniqueActivities;
  } catch (error: any) {
    throw new Error(`Failed to fetch activities: ${error.message}`);
  }
}

export async function fetchTaggedThreads(userId: string) {
  try {
    connectToDB();

    // Find all threads authored by the user
    const user = await User.findOne({ id: userId });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Find all threads that contain the user's username
    const threads = await Thread.find({
      text: { $regex: "@" + user.username, $options: "i" },
    })
      .sort({ createdAt: "desc" })
      .populate({
        path: "author",
        model: User,
        select: "id name image",
      })
      .populate({
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "id name image",
        },
      })
      .populate({
        path: "likedBy",
        model: User,
        select: "_id id",
      });

    return threads;
  } catch (error: any) {
    throw new Error(`Failed to fetch user tagged threads: ${error.message}`);
  }
}
