"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  currentUserId: string;
  authorId: string;
}

function EditProfile({ currentUserId, authorId }: Props) {
  const router = useRouter();

  if (currentUserId !== authorId) return null;

  return (
    <Link href="/edit-profile">
      <div className="flex items-center gap-2">
        <Image
          src="/assets/edit.svg"
          alt="delete"
          width={20}
          height={20}
          className="cursor-pointer object-contain"
        />
        <p className="text-small-medium text-gray-1 max-md:hidden">Edit Profile</p>
      </div>
    </Link>
  );
}

export default EditProfile;
