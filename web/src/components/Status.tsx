"use client";

import { ValidStatuses } from "@/lib/types";
import { Badge } from "@tremor/react";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiPauseCircle,
} from "react-icons/fi";
import { HoverPopup } from "./HoverPopup";
import { useTranslations } from "next-intl";

const transWelcome = useTranslations("general");

export function IndexAttemptStatus({
  status,
  errorMsg,
  size = "md",
}: {
  status: ValidStatuses;
  errorMsg?: string | null;
  size?: "xs" | "sm" | "md" | "lg";
}) {
  let badge;

  if (status === "failed") {
    const icon = (
      <Badge size={size} color="red" icon={FiAlertTriangle}>
        {transWelcome("failed")}
      </Badge>
    );
    if (errorMsg) {
      badge = (
        <HoverPopup
          mainContent={<div className="cursor-pointer">{icon}</div>}
          popupContent={
            <div className="w-64 p-2 break-words overflow-hidden whitespace-normal">
              {errorMsg}
            </div>
          }
        />
      );
    } else {
      badge = icon;
    }
  } else if (status === "success") {
    badge = (
      <Badge size={size} color="green" icon={FiCheckCircle}>
        {transWelcome("succeeded")}
      </Badge>
    );
  } else if (status === "in_progress") {
    badge = (
      <Badge size={size} color="amber" icon={FiClock}>
        {transWelcome("in-progress")}
      </Badge>
    );
  } else if (status === "not_started") {
    badge = (
      <Badge size={size} color="fuchsia" icon={FiClock}>
        {transWelcome("scheduled")}
      </Badge>
    );
  }

  return <div>{badge}</div>;
}

export function CCPairStatus({
  status,
  disabled,
  isDeleting,
  size = "md",
}: {
  status: ValidStatuses;
  disabled: boolean;
  isDeleting: boolean;
  size?: "xs" | "sm" | "md" | "lg";
}) {
  let badge;

  if (isDeleting) {
    badge = (
      <Badge size={size} color="red" icon={FiAlertTriangle}>
        {transWelcome("deleting")}
      </Badge>
    );
  } else if (disabled) {
    badge = (
      <Badge size={size} color="yellow" icon={FiPauseCircle}>
        {transWelcome("paused")}
      </Badge>
    );
  } else if (status === "failed") {
    badge = (
      <Badge size={size} color="red" icon={FiAlertTriangle}>
        {transWelcome("error")}
      </Badge>
    );
  } else {
    badge = (
      <Badge size={size} color="green" icon={FiCheckCircle}>
        {transWelcome("active")}
      </Badge>
    );
  }

  return <div>{badge}</div>;
}
