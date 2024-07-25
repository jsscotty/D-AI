"use client";

import { FiEdit2 } from "react-icons/fi";
import { useTranslations } from "next-intl";



export function EditButton({ onClick }: { onClick: () => void }) {
  const transWelcome = useTranslations("general");
  return (
    <div
      className={`
        my-auto 
        flex 
        mb-1 
        hover:bg-hover 
        w-fit 
        p-2 
        cursor-pointer 
        rounded-lg
        border-border
        text-sm`}
      onClick={onClick}
    >
      <FiEdit2 className="mr-1 my-auto" />
      {transWelcome("edit")}
    </div>
  );
}
