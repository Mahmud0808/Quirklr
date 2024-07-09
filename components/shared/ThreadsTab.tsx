import {
  fetchTaggedThreads,
  fetchUserReplies,
  fetchUserThreads,
} from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";
import { fetchCommunityThreads } from "@/lib/actions/community.actions";

interface Props {
  currentUserId: string;
  accountId: string;
  listType: string;
}

const ThreadsTab = async ({ currentUserId, accountId, listType }: Props) => {
  let tempResult: any;
  let finalResult: any;
  let userObject: any;

  if (listType === "User") {
    tempResult = await fetchUserThreads(accountId);
    finalResult = tempResult.threads;
    userObject = tempResult;
  } else if (listType === "Community") {
    tempResult = await fetchCommunityThreads(accountId);
    finalResult = tempResult.threads;
    userObject = tempResult;
  } else if (listType === "Replies") {
    tempResult = await fetchUserReplies(accountId);
    finalResult = tempResult;
    userObject = tempResult;
  } else if (listType == "Tagged") {
    tempResult = await fetchTaggedThreads(accountId);
    finalResult = tempResult;
    userObject = tempResult;
  }

  let noresult: any;

  if (listType === "User" || listType === "Community") {
    noresult = "No threads found";
  } else if (listType === "UserReplies") {
    noresult = "No replies found";
  } else if (listType === "Tagged") {
    noresult = "No tagged threads found";
  }

  return (
    <section className="mt-9 flex flex-col gap-10">
      {finalResult.length === 0 ? (
        <p className="no-result">{noresult}</p>
      ) : (
        finalResult.map((thread: any) => (
          <ThreadCard
            key={thread._id.toString()}
            id={thread._id.toString()}
            currentUserId={currentUserId}
            parentId={thread.parentId}
            content={thread.text}
            author={
              listType === "User"
                ? {
                    id: userObject.id,
                    name: userObject.name,
                    image: userObject.image,
                  }
                : {
                    id: thread.author.id,
                    name: thread.author.name,
                    image: thread.author.image,
                  }
            }
            community={thread.community}
            createdAt={thread.createdAt}
            comments={thread.children}
            isViewingCommunity={listType === "Community"}
            likes={thread.likedBy}
          />
        ))
      )}
    </section>
  );
};

export default ThreadsTab;
