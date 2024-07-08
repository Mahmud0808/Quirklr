import {
  fetchActivities,
  fetchUser,
  fetchUsers,
} from "@/lib/actions/user.actions";
import { timeAgo } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const Page = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const userInfo = await fetchUser(user.id);

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
                    className="object-center rounded-full w-7 h-7"
                  />
                  <p className="ml-2 !text-small-regular text-light-1">
                    <span className="text-primary-500">
                      <b>{activity.author.name}</b>
                    </span>{" "}
                    {activity.type === "comment"
                      ? "commented on your thread."
                      : "replied to your comment."}
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
