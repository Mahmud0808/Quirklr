import Image from "next/image";
import Link from "next/link";
import ExpandableText from "../ui/ExpandableText";
import DeleteThread from "../forms/DeleteThread";
import { formatDateString } from "@/lib/utils";
import LikeButton from "../shared/LikeButton";

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    id: string;
    name: string;
    image: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
  likes: {
    id: string;
  }[];
  isViewingThread?: boolean;
  isViewingCommunity?: boolean;
}

const ThreadCard = ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
  likes,
  isViewingThread = false,
  isViewingCommunity = false,
}: Props) => {
  return (
    <article
      className={`flex w-full flex-col rounded-lg ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt="profile image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
            <div className={`thread-card_bar ${isComment && "mb-2"}`} />
          </div>
          <div className="flex w-full flex-col">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {author.name}
              </h4>
            </Link>
            <ExpandableText text={content} />
            <div className={`mt-5 flex flex-col gap-3 ${isComment && "mb-10"}`}>
              <div className="flex gap-3.5">
                <LikeButton
                  threadId={id}
                  userId={currentUserId}
                  likes={likes.map((user: any) => user.id.toString())}
                />
                <Link href={`/thread/${id}`}>
                  <Image
                    src="/assets/reply.svg"
                    alt="reply"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </Link>
                <Image
                  src="/assets/repost.svg"
                  alt="repost"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Image
                  src="/assets/share.svg"
                  alt="share"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
              </div>
              <div className="flex items-center">
                {isComment && comments.length > 0 && (
                  <div className="flex items-center gap-2">
                    {comments.slice(0, 2).map((comment, index) => (
                      <Image
                        key={index}
                        src={comment.author.image}
                        alt={`user_${index}`}
                        width={24}
                        height={24}
                        className={`${
                          index !== 0 && "-ml-5"
                        } rounded-full object-cover`}
                      />
                    ))}
                    <Link href={`/thread/${id}`}>
                      <p className="text-subtle-medium text-gray-1">
                        {comments.length}{" "}
                        {comments.length > 1 ? "replies" : "reply"}
                        &nbsp;-&nbsp;
                      </p>
                    </Link>
                  </div>
                )}
                <p className="text-subtle-medium text-gray-1">
                  {isComment && formatDateString(createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <DeleteThread
          threadId={JSON.stringify(id)}
          currentUserId={currentUserId}
          authorId={author.id}
          parentId={parentId}
          isComment={isComment}
        />
      </div>
      <div className="mt-5 flex items-center">
        <span className="flex items-center justify-center text-subtle-medium text-gray-1">
          {!isViewingThread && !isComment && comments.length > 0 && (
            <div className="ml-2 flex items-center gap-2">
              {comments.slice(0, 2).map((comment, index) => (
                <Image
                  key={index}
                  src={comment.author.image}
                  alt={`user_${index}`}
                  width={24}
                  height={24}
                  className={`${
                    index !== 0 && "-ml-5"
                  } object-center rounded-full w-6 h-6`}
                />
              ))}
              <Link href={`/thread/${id}`}>
                <p className="text-subtle-medium text-gray-1">
                  {comments.length} {comments.length > 1 ? "replies" : "reply"}
                  &nbsp;-&nbsp;
                </p>
              </Link>
            </div>
          )}
          {!isComment && formatDateString(createdAt)}
          {!isComment && !isViewingCommunity && community && (
            <>
              &nbsp;-&nbsp;
              <Link
                href={`/communities/${community.id}`}
                className="flex items-center"
              >
                <div className="flex items-center">
                  <b>{community.name}</b>
                  <Image
                    src={community.image}
                    alt="community image"
                    height={16}
                    width={16}
                    className="ml-1 object-center rounded-full w-4 h-4"
                  />
                </div>
              </Link>
            </>
          )}
        </span>
      </div>
    </article>
  );
};

export default ThreadCard;
