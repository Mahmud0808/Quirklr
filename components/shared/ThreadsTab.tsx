import { fetchUserThreads } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";
import { fetchCommunityThreads } from "@/lib/actions/community.actions";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const ThreadsTab = async ({ currentUserId, accountId, accountType }: Props) => {
  let result: any;

  if (accountType === "User") {
    result = await fetchUserThreads(accountId);
  } else if (accountType === "Community") {
    result = await fetchCommunityThreads(accountId);
  }

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.threads.length === 0 ? (
        <p className="no-result">No thread found</p>
      ) : (
        result.threads.map((thread: any) => (
          <ThreadCard
            key={thread._id}
            id={thread._id}
            currentUserId={currentUserId}
            parentId={thread.parentId}
            content={thread.text}
            author={
              accountType === "User"
                ? { id: result.id, name: result.name, image: result.image }
                : {
                    id: thread.author.id,
                    name: thread.author.name,
                    image: thread.author.image,
                  }
            }
            community={thread.community} // TODO: implement community
            createdAt={thread.createdAt}
            comments={thread.children}
          />
        ))
      )}
    </section>
  );
};

export default ThreadsTab;
