import Image from "next/image";
import EditProfile from "../forms/EditProfile";
import {
  RegExpMatcher,
  TextCensor,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";

interface Props {
  accountId: string;
  authUserId: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  type?: "User" | "Community";
}

const ProfileHeader = ({
  accountId,
  authUserId,
  name,
  username,
  imgUrl,
  bio,
  type,
}: Props) => {
  const censor = new TextCensor();
  const matcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
  });

  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={imgUrl}
            alt="profile image"
            height={80}
            width={80}
            className="object-center rounded-full h-20 w-20 shadow-2xl"
          />
          <div className="flex-1 ml-3">
            <h2 className="text-left text-heading3-bold text-light-1">
              {name}
            </h2>
            <p className="text-base-medium text-gray-1">@{username}</p>
          </div>
        </div>
        <EditProfile currentUserId={authUserId} authorId={accountId} />
      </div>
      {type === "User" && (
        <p className="mt-6 max-w-lg text-base-regular text-light-2">
          {censor.applyTo(bio, matcher.getAllMatches(bio))}
        </p>
      )}
      <div className="mt-12 h-0.5 w-full bg-dark-3" />
    </div>
  );
};

export default ProfileHeader;
