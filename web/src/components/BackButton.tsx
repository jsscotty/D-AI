"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FiChevronLeft } from "react-icons/fi";

export function BackButton({
  behaviorOverride,
}: {
  behaviorOverride?: () => void;
}) {
  const router = useRouter();
  const transWelcome = useTranslations("general");

  return (
    <div
      className={`
        my-auto 
        flex 
        mb-1 
        hover:bg-hover-light 
        w-fit 
        p-1
        pr-2 
        cursor-pointer 
        rounded-lg 
        text-sm`}
      onClick={() => {
        if (behaviorOverride) {
          behaviorOverride();
        } else {
          router.back();
        }
      }}
    >
      <FiChevronLeft className="mr-1 my-auto" />
      {transWelcome("back")}
    </div>
  );
}
