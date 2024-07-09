"use client";

import { useState } from "react";
import { likeThread, removeLikeFromThread } from "@/lib/actions/thread.actions";
import Image from "next/image";

const LikeButton = ({
  threadId,
  userId,
  likes,
}: {
  threadId: string;
  userId: string;
  likes: string[];
}) => {
  const [liked, setLiked] = useState(likes.includes(userId));
  const [likeCount, setLikeCount] = useState(likes.length);

  const handleClick = async () => {
    if (liked) {
      await removeLikeFromThread(threadId, userId);
      setLikeCount(likeCount - 1);
    } else {
      await likeThread(threadId, userId);
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  return (
    <button onClick={handleClick} className="relative inline-block">
      {liked ? (
        <Image
          src="/assets/heart-filled.svg"
          alt="heart"
          width={24}
          height={24}
          className="cursor-pointer object-contain"
        />
      ) : (
        <Image
          src="/assets/heart-gray.svg"
          alt="heart"
          width={24}
          height={24}
          className="cursor-pointer object-contain"
        />
      )}
      {likeCount > 0 && (
        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-light-2 text-x-small-semibold pointer-events-none">
          {likeCount}
        </span>
      )}
    </button>
  );
};

export default LikeButton;
