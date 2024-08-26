import { User } from "@/lib/types";
import { Persona } from "../admin/assistants/interfaces";
import { checkUserOwnsAssistant } from "@/lib/assistants/checkOwnership";
import {
  FiImage,
  FiLock,
  FiMoreHorizontal,
  FiSearch,
  FiUnlock,
} from "react-icons/fi";
import { CustomTooltip } from "@/components/tooltip/CustomTooltip";
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
  const trans = useTranslations("assistants");

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
              trans("shared-with-you")
            )}
          </div>
        )}
        <div className="relative mt-4 text-xs flex text-subtle">
          <span className="font-medium">Powers:</span>{" "}
          {assistant.tools.length == 0 ? (
            <p className="ml-2">None</p>
          ) : (
            assistant.tools.map((tool, ind) => {
              if (tool.name === "SearchTool") {
                return <FiSearch key={ind} className="ml-1 h-3 w-3 my-auto" />;
              } else if (tool.name === "ImageGenerationTool") {
                return <FiImage key={ind} className="ml-1 h-3 w-3 my-auto" />;
              }
            })
          )}
        </div>
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
