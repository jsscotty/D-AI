import { BasicClickable } from "@/components/BasicClickable";
import { DanswerDocument } from "@/lib/search/interfaces";
import { useState } from "react";
import { FiBook, FiFilter } from "react-icons/fi";
import { useTranslations } from "next-intl";
export function SelectedDocuments({
  selectedDocuments,
}: {
  selectedDocuments: DanswerDocument[];
}) {
  const trans = useTranslations("chat");
  if (selectedDocuments.length === 0) {
    return null;
  }

  return (
    <BasicClickable>
      <div className="flex text-xs max-w-md overflow-hidden">
        <FiBook className="my-auto mr-1" />{" "}
        <div className="w-fit whitespace-nowrap">
          {trans("chatting-with-x", { num: selectedDocuments.length })}
        </div>
      </div>
    </BasicClickable>
  );
}
