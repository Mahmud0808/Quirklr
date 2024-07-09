import CommunityCard from "@/components/cards/CommunityCard";
import LoadMoreButton from "@/components/shared/LoadMoreButton";
import SearchBar from "@/components/shared/SearchBar";
import { fetchCommunities } from "@/lib/actions/community.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }

  // Fetch all communities
  const result = await fetchCommunities({
    searchString: searchParams.q,
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 25,
    sortBy: "asc",
  });

  return (
    <section>
      <h1 className="head-text mb-10">Communities</h1>
      <div className="mt-5">
        <SearchBar routeType="communities" />
      </div>
      <div className="mt-14 grid gap-9 sm:grid-cols-1 md:grid-cols-2">
        {result.communities.length === 0 ? (
          <p className="no-result">No communities found</p>
        ) : (
          <>
            {result.communities.map((community) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                username={community.username}
                imgUrl={community.image}
                members={community.members}
              />
            ))}
          </>
        )}
      </div>
      <LoadMoreButton
        currentRoute="/communities"
        hasNextPage={result.hasNext}
        currentPage={searchParams?.page ? +searchParams.page : 1}
        currentSearch={searchParams.q}
      />
    </section>
  );
}

export default Page;
