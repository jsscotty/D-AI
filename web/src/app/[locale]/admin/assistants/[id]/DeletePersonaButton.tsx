"use client";

import { Button } from "@tremor/react";
import { FiTrash } from "react-icons/fi";
import { deletePersona } from "../lib";
import { useRouter } from "next/navigation";
import { SuccessfulPersonaUpdateRedirectType } from "../enums";
import { useTranslations } from "next-intl";

export function DeletePersonaButton({
  personaId,
  redirectType,
}: {
  personaId: number;
  redirectType: SuccessfulPersonaUpdateRedirectType;
}) {
  const router = useRouter();
  const trans = useTranslations("admin");
  return (
    <Button
      size="xs"
      color="red"
      onClick={async () => {
        const response = await deletePersona(personaId);
        if (response.ok) {
          router.push(
            redirectType === SuccessfulPersonaUpdateRedirectType.ADMIN
              ? `/admin/assistants?u=${Date.now()}`
              : `/chat`
          );
        } else {
          alert(`${trans("delete-fail")} - ${await response.text()}`);
        }
      }}
      icon={FiTrash}
    >
      Delete
    </Button>
  );
}
