import ThreadCard from "@/components/cards/ThreadCard";
import LoadMoreButton from "@/components/shared/LoadMoreButton";
import { fetchThreads } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs/server";

async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const threadList = await fetchThreads({
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 30,
  });
  const user = await currentUser();

  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {threadList.threads.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {threadList.threads.map((thread) => (
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
              />
            ))}
          </>
        )}
        <LoadMoreButton
          currentRoute="/"
          hasNextPage={threadList.hasNext}
          currentPage={searchParams?.page ? +searchParams.page : 1}
        />
      </section>
    </>
  );
}

export default Home;
