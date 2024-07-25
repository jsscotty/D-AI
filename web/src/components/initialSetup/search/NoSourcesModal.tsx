"use client";

import { Button, Divider, Text } from "@tremor/react";
import { Modal } from "../../Modal";
import Link from "next/link";
import { FiMessageSquare, FiShare2 } from "react-icons/fi";
import { useContext, useState } from "react";
import { SettingsContext } from "@/components/settings/SettingsProvider";
import { useTranslations } from "next-intl";

export function NoSourcesModal() {
  const settings = useContext(SettingsContext);
  const transWelcome = useTranslations("NoSourcesModal");
  const [isHidden, setIsHidden] = useState(
    !settings?.settings.search_page_enabled ?? false
  );

  if (isHidden) {
    return null;
  }

  return (
    <Modal
      className="max-w-4xl"
      title={transWelcome("NoSourceConnected")}
      onOutsideClick={() => setIsHidden(true)}
    >
      <div className="text-base">
        <div>
          <Text>
          {transWelcome("Connect-at-least-one-source")}
            
          </Text>
          <Link href="/admin/add-connector">
            <Button className="mt-3" size="xs" icon={FiShare2}>
            {transWelcome("Connect-Source")}
            </Button>
          </Link>
          <Divider />
          <div>
            <Text>
            {transWelcome("Or-without-Source")}
            </Text>
            <Link href="/chat">
              <Button className="mt-3" size="xs" icon={FiMessageSquare}>
              {transWelcome("Start-Chatting")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}
