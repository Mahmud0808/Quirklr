"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface Props {
  currentRoute: string;
  hasNextPage: boolean;
  currentPage: number;
  currentSearch?: string;
}

function LoadMoreButton({
  currentRoute,
  hasNextPage,
  currentPage,
  currentSearch,
}: Props) {
  const router = useRouter();

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    const queryParams = new URLSearchParams();
    if (currentSearch) {
      queryParams.set("q", currentSearch);
    }
    queryParams.set("page", nextPage.toString());
    router.push(`${currentRoute}?${queryParams.toString()}`);
  };

  return (
    <>
      {hasNextPage && (
        <div className="mt-12 flex justify-center">
          <Button
            type="button"
            onClick={handleLoadMore}
            className="h-auto min-w-[74px] rounded-xl border-2 border-primary-500 text-[14px] text-light-1 !important"
          >
            <span>View More</span>
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Button>
        </div>
      )}
    </>
  );
}

export default LoadMoreButton;
