import ThreadCard from "@/components/cards/ThreadCard";
import CommentBox from "@/components/forms/CommentBox";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) {
    return null;
  }

  const user = await currentUser();

  if (!user) {
    return null;
  }

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }

  const thread = await fetchThreadById(params.id);

  return (
    <section className="relative">
      <div>
        <ThreadCard
          key={thread._id.toString()}
          id={thread._id.toString()}
          currentUserId={user?.id || ""}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
          likes={thread.likedBy}
          isViewingThread={true}
        />
      </div>
      <div className="mt-7">
        <CommentBox
          threadId={params.id}
          currentUserId={JSON.stringify(userInfo._id)}
          currentUserImage={userInfo.image}
        />
      </div>
      <div className="mt-10">
        {thread.children.map((comment: any) => (
          <ThreadCard
            key={comment._id.toString()}
            id={comment._id.toString()}
            currentUserId={user?.id || ""}
            parentId={comment.parentId}
            content={comment.text}
            author={comment.author}
            community={comment.community}
            createdAt={comment.createdAt}
            comments={comment.children}
            likes={comment.likedBy}
            isComment={true}
          />
        ))}
      </div>
    </section>
  );
};

export default Page;
