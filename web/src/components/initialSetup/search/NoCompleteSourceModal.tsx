"use client";

import { Modal } from "../../Modal";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CCPairBasicInfo } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export function NoCompleteSourcesModal({
  ccPairs,
}: {
  ccPairs: CCPairBasicInfo[];
}) {
  const router = useRouter();
  const [isHidden, setIsHidden] = useState(false);
  const transWelcome = useTranslations("NoCompleteSourceModal");

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (isHidden) {
    return null;
  }

  const totalDocs = ccPairs.reduce(
    (acc, ccPair) => acc + ccPair.docs_indexed,
    0
  );

  return (
    <Modal
      className="max-w-4xl"
      title={transWelcome("Not-fully-synched")}
      onOutsideClick={() => setIsHidden(true)}
    >
      <div className="text-sm">
        <div>
          <div>
          title={transWelcome("Connected-but-not-synched")}{" "}
            <b>{totalDocs}</b> {transWelcome("documents")}
            <br />
            <br />
            {transWelcome("connector-status")}{" "}
            <Link className="text-link" href="admin/indexing/status">
            {transWelcome("Existing-Connectors-Page")}
            </Link>
            .
            <br />
            <br />
            <p
              className="text-link cursor-pointer inline"
              onClick={() => {
                setIsHidden(true);
              }}
            >
               {transWelcome("Partial-Question")}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
