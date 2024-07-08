import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const userInfo = await fetchUser(params.id);

  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }

  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
        type="User"
      />

      <div className="mt-9">
        <Tabs defaultValue="Threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.label} className="tab">
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <p className="max-sm:hidden">{tab.label}</p>
                {tab.label == "Threads" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {userInfo?.threads?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="Threads" className="w-full text-light-1">
            <ThreadsTab
              currentUserId={user.id}
              accountId={userInfo.id}
              listType="User"
            />
          </TabsContent>
          <TabsContent value="Replies" className="w-full text-light-1">
            <ThreadsTab
              currentUserId={user.id}
              accountId={userInfo.id}
              listType="Replies"
            />
          </TabsContent>
          <TabsContent value="Tagged" className="w-full text-light-1">
            <ThreadsTab
              currentUserId={user.id}
              accountId={userInfo.id}
              listType="Tagged"
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Page;
