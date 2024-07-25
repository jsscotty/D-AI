"use client";

import { Button, Text } from "@tremor/react";
import { Modal } from "./Modal";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function SwitchModelModal({
  embeddingModelName,
}: {
  embeddingModelName: undefined | null | string;
}) {
  const transWelcome = useTranslations("SwitchModelModal");

  return (
    // TODO: translation
    <Modal className="max-w-4xl">
      <div className="text-base">
        <h2 className="text-xl font-bold mb-4 pb-2 border-b border-border flex">
          {transWelcome("switch-model")}
        </h2>
        <Text>
          {transWelcome("switch-model-desc1")}(
          <i>{embeddingModelName || "thenlper/gte-small"}</i>).{" "}
          {transWelcome("switch-model-desc2")}
          <br />
          <br />
          {transWelcome("switch-model-desc3")}
        </Text>

        <div className="flex mt-4">
          <Link href="/admin/models/embedding" className="w-fit mx-auto">
            <Button size="xs">{transWelcome("choose-moddel")}</Button>
          </Link>
        </div>
      </div>
    </Modal>
  );
}
