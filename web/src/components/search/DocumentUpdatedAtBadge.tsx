import { timeAgo } from "@/lib/time";
import { MetadataBadge } from "../MetadataBadge";

export function DocumentUpdatedAtBadge({ updatedAt }: { updatedAt: string }) {
  // TODO: translation
  return <MetadataBadge value={"Updated " + timeAgo(updatedAt)} />;
}
