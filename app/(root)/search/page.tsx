import UserCard from "@/components/cards/UserCard";
import LoadMoreButton from "@/components/shared/LoadMoreButton";
import SearchBar from "@/components/shared/SearchBar";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
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

  // Fetch all user
  const result = await fetchUsers({
    userId: user.id,
    searchString: searchParams.q,
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 25,
    sortBy: "asc",
  });

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>
      <SearchBar routeType="search" />
      <div className="mt-14 flex flex-col gap-9">
        {result.users.length === 0 ? (
          <p className="no-result">No users found</p>
        ) : (
          <>
            {result.users.map((person) => (
              <UserCard
                key={person.id}
                id={person.id}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
                personType="User"
              />
            ))}
          </>
        )}
      </div>
      <LoadMoreButton
        currentRoute="/search"
        hasNextPage={result.hasNext}
        currentPage={searchParams?.page ? +searchParams.page : 1}
        currentSearch={searchParams.q}
        />
    </section>
  );
}

export default Page;
