"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  personType: string;
}

const UserCard = ({ id, name, username, imgUrl, personType }: Props) => {
  const router = useRouter();

  return (
    <article className="user-card">
      <div className="user-card_avatar">
        <Image
          src={imgUrl}
          alt="profile image"
          height={56}
          width={56}
          className="object-center rounded-full w-14 h-14"
        />
        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1">{name}</h4>
          <p className="text-small-medium text-gray-1">@{username}</p>
        </div>
      </div>
      <Button
        className="user-card_btn"
        onClick={() => {
          if (personType === "User") {
            router.push(`/profile/${id}`);
          } else if (personType === "Community") {
            router.push(`/communities/${id}`);
          }
        }}
      >
        View
      </Button>
    </article>
  );
};

export default UserCard;
