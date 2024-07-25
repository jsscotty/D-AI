"use client";

import { errorHandlingFetcher, RedirectError } from "@/lib/fetcher";
import useSWR from "swr";
import { Modal } from "../Modal";
import { useState } from "react";
import { useTranslations } from "next-intl";

export const HealthCheckBanner = ({
  secondsUntilExpiration,
}: {
  secondsUntilExpiration?: number | null;
}) => {
  const { error } = useSWR("/api/health", errorHandlingFetcher);
  const [expired, setExpired] = useState(false);
  const transWelcome = useTranslations("healthcheck");

  if (secondsUntilExpiration !== null && secondsUntilExpiration !== undefined) {
    setTimeout(
      () => {
        setExpired(true);
      },
      secondsUntilExpiration * 1000 - 200
    );
  }

  if (!error && !expired) {
    return null;
  }

  if (error instanceof RedirectError || expired) {
    return (
      <Modal
        width="w-1/4"
        className="overflow-y-hidden flex flex-col"
        title={transWelcome("You've-been-logged-out")}
      >
        <div className="flex flex-col gap-y-4">
          <p className="text-sm">
          {transWelcome("UserNotice-Session-expired")}
          </p>
          <a
            href="/auth/login"
            className="w-full mt-4 mx-auto rounded-md text-text-200 py-2 bg-background-900 text-center hover:bg-emphasis animtate duration-300 transition-bg"
          >
            {transWelcome("Log-in")}
          </a>
        </div>
      </Modal>
    );
  } else {
    return (
      <div className="fixed top-0 left-0 z-[101] w-full text-xs mx-auto bg-gradient-to-r from-red-900 to-red-700 p-2 rounded-sm border-hidden text-text-200">
        <p className="font-bold pb-1"> {transWelcome("Notice-Backend-Unavailable")}</p>

        <p className="px-1">
        {transWelcome("Backend-Unavailable-Reason")}
        </p>
      </div>
    );
  }
};
