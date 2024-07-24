import { User } from "@/lib/types";
import { Persona } from "../admin/assistants/interfaces";
import { checkUserOwnsAssistant } from "@/lib/assistants/checkOwnership";
import { FiLock, FiUnlock } from "react-icons/fi";
import { useTranslations } from "next-intl";

export function AssistantSharedStatusDisplay({
  assistant,
  user,
}: {
  assistant: Persona;
  user: User | null;
}) {
  const isOwnedByUser = checkUserOwnsAssistant(user, assistant);

  const assistantSharedUsersWithoutOwner = assistant.users?.filter(
    (u) => u.id !== assistant.owner?.id
  );
  const trans = useTranslations("assistants")

  if (assistant.is_public) {
    return (
      <div className="text-subtle text-sm flex items-center">
        <FiUnlock className="mr-1" />
        {trans("public")}
      </div>
    );
  }

  if (assistantSharedUsersWithoutOwner.length > 0) {
    return (
      <div className="text-subtle text-sm flex items-center">
        <FiUnlock className="mr-1" />
        {isOwnedByUser ? (
          `${trans("shared-with")}: ${
            assistantSharedUsersWithoutOwner.length <= 4
              ? assistantSharedUsersWithoutOwner.map((u) => u.email).join(", ")
              : `${assistantSharedUsersWithoutOwner
                  .slice(0, 4)
                  .map((u) => u.email)
                  .join(", ")} and ${assistant.users.length - 4} others...`
          }`
        ) : (
          <div>
            {assistant.owner ? (
              <div>
                {trans("shared-by")} <i>{assistant.owner?.email}</i>
              </div>
            ) : (
              {trans("shared-with-you")}
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="text-subtle text-sm flex items-center">
      <FiLock className="mr-1" />
      {trans("private")}
    </div>
  );
}
