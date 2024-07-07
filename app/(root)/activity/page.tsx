import {
  fetchActivities,
  fetchUser,
  fetchUsers,
} from "@/lib/actions/user.actions";
import { timeAgo } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const userInfo = await fetchUser(user.id);

  // Fetch all user
  const result = await fetchUsers({
    userId: user.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
    sortBy: "desc",
  });

  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }

  // Fetch activities (notifications)
  const activities = await fetchActivities(userInfo._id);

  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>
      <section className="mt-10 flex flex-col gap-5">
        {activities.length === 0 ? (
          <p className="no-result">No activity found</p>
        ) : (
          <>
            {activities.map((activity: any) => (
              <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                <article className="activity-card">
                  <Image
                    src={activity.author.image}
                    alt="profile image"
                    width={28}
                    height={28}
                    className="rounded-full object-cover"
                  />
                  <p className="ml-2 !text-small-regular text-light-1">
                    <span className="text-primary-500">
                      <b>{activity.author.name}</b>
                    </span>{" "}
                    commented on your thread.
                  </p>
                  <p className="ml-auto !text-small-regular text-gray-1">
                    {timeAgo(new Date(activity.createdAt))}
                  </p>
                </article>
              </Link>
            ))}
          </>
        )}
      </section>
    </section>
  );
};

export default Page;
