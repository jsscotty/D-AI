"use client";

import { useState } from "react";
import { MinimalUserSnapshot, User } from "@/lib/types";
import { Persona } from "@/app/[locale]/admin/assistants/interfaces";
import { Divider, Text } from "@tremor/react";
import {
  FiArrowDown,
  FiArrowUp,
  FiEdit2,
  FiMoreHorizontal,
  FiPlus,
  FiSearch,
  FiX,
  FiShare2,
} from "react-icons/fi";
import Link from "next/link";
import { orderAssistantsForUser } from "@/lib/assistants/orderAssistants";
import {
  addAssistantToList,
  moveAssistantDown,
  moveAssistantUp,
  removeAssistantFromList,
} from "@/lib/assistants/updateAssistantPreferences";
import { AssistantIcon } from "@/components/assistants/AssistantIcon";
import { DefaultPopover } from "@/components/popover/DefaultPopover";
import { PopupSpec, usePopup } from "@/components/admin/connectors/Popup";
import { useRouter } from "next/navigation";
import { NavigationButton } from "../NavigationButton";
import { AssistantsPageTitle } from "../AssistantsPageTitle";
import { checkUserOwnsAssistant } from "@/lib/assistants/checkOwnership";
import { AssistantSharingModal } from "./AssistantSharingModal";
import { AssistantSharedStatusDisplay } from "../AssistantSharedStatus";
import useSWR from "swr";
import { errorHandlingFetcher } from "@/lib/fetcher";
import { ToolsDisplay } from "../ToolsDisplay";
import { useTranslations } from "next-intl";

function AssistantListItem({
  assistant,
  user,
  allAssistantIds,
  allUsers,
  isFirst,
  isLast,
  isVisible,
  setPopup,
}: {
  assistant: Persona;
  user: User | null;
  allUsers: MinimalUserSnapshot[];
  allAssistantIds: number[];
  isFirst: boolean;
  isLast: boolean;
  isVisible: boolean;
  setPopup: (popupSpec: PopupSpec | null) => void;
}) {
  const router = useRouter();
  const [showSharingModal, setShowSharingModal] = useState(false);

  const currentChosenAssistants = user?.preferences?.chosen_assistants;
  const isOwnedByUser = checkUserOwnsAssistant(user, assistant);
  const transGeneral = useTranslations("general");
  const transAssistants = useTranslations("assistants");
  return (
    <>
      <AssistantSharingModal
        assistant={assistant}
        user={user}
        allUsers={allUsers}
        onClose={() => {
          setShowSharingModal(false);
          router.refresh();
        }}
        show={showSharingModal}
      />
      <div
        className="
          bg-background-emphasis
          rounded-lg
          shadow-md
          p-4
          mb-4
          flex
          justify-between
          items-center
        "
      >
        <div className="w-3/4">
          <div className="flex items-center">
            <AssistantIcon assistant={assistant} />
            <h2 className="text-xl font-semibold mb-2 my-auto ml-2">
              {assistant.name}
            </h2>
          </div>
          {assistant.tools.length > 0 && (
            <ToolsDisplay tools={assistant.tools} />
          )}
          <div className="text-sm mt-2">{assistant.description}</div>
          <div className="mt-2">
            <AssistantSharedStatusDisplay assistant={assistant} user={user} />
          </div>
        </div>
        {isOwnedByUser && (
          <div className="ml-auto flex items-center">
            {!assistant.is_public && (
              <div
                className="mr-4 rounded p-2 cursor-pointer hover:bg-hover"
                onClick={() => setShowSharingModal(true)}
              >
                <FiShare2 size={16} />
              </div>
            )}
            <Link
              href={`/assistants/edit/${assistant.id}`}
              className="mr-4 rounded p-2 cursor-pointer hover:bg-hover"
            >
              <FiEdit2 size={16} />
            </Link>
          </div>
        )}
        <DefaultPopover
          content={
            <div className="hover:bg-hover rounded p-2 cursor-pointer">
              <FiMoreHorizontal size={16} />
            </div>
          }
          side="bottom"
          align="start"
          sideOffset={5}
        >
          {[
            ...(!isFirst
              ? [
                  <div
                    key="move-up"
                    className="flex items-center gap-x-2"
                    onClick={async () => {
                      const success = await moveAssistantUp(
                        assistant.id,
                        currentChosenAssistants || allAssistantIds
                      );
                      if (success) {
                        setPopup({
                          message: transAssistants("move-up-success", {
                            assistantName: assistant.name,
                          }),
                          type: "success",
                        });
                        router.refresh();
                      } else {
                        setPopup({
                          message: transAssistants("move-up-fail", {
                            assistantName: assistant.name,
                          }),
                          type: "error",
                        });
                      }
                    }}
                  >
                    <FiArrowUp /> {transAssistants("move-up")}
                  </div>,
                ]
              : []),
            ...(!isLast
              ? [
                  <div
                    key="move-down"
                    className="flex items-center gap-x-2"
                    onClick={async () => {
                      const success = await moveAssistantDown(
                        assistant.id,
                        currentChosenAssistants || allAssistantIds
                      );
                      if (success) {
                        setPopup({
                          message: transAssistants("move-down-success", {
                            assistantName: assistant.name,
                          }),
                          type: "success",
                        });
                        router.refresh();
                      } else {
                        setPopup({
                          message: transAssistants("move-down-fail", {
                            assistantName: assistant.name,
                          }),
                          type: "error",
                        });
                      }
                    }}
                  >
                    <FiArrowDown /> {transAssistants("move-down")}
                  </div>,
                ]
              : []),
            isVisible ? (
              <div
                key="remove"
                className="flex items-center gap-x-2"
                onClick={async () => {
                  if (
                    currentChosenAssistants &&
                    currentChosenAssistants.length === 1
                  ) {
                    setPopup({
                      message: transAssistants("remove-error-no-assistant", {
                        assistantName: assistant.name,
                      }),
                      type: "error",
                    });
                    return;
                  }

                  const success = await removeAssistantFromList(
                    assistant.id,
                    currentChosenAssistants || allAssistantIds
                  );
                  if (success) {
                    setPopup({
                      message: transAssistants("remove-success", {
                        assistantName: assistant.name,
                      }),
                      type: "success",
                    });
                    router.refresh();
                  } else {
                    setPopup({
                      message: transAssistants("remove-error", {
                        assistantName: assistant.name,
                      }),
                      type: "error",
                    });
                  }
                }}
              >
                <FiX />{" "}
                {isOwnedByUser
                  ? transAssistants("hide")
                  : transAssistants("remove")}
              </div>
            ) : (
              <div
                key="add"
                className="flex items-center gap-x-2"
                onClick={async () => {
                  const success = await addAssistantToList(
                    assistant.id,
                    currentChosenAssistants || allAssistantIds
                  );
                  if (success) {
                    setPopup({
                      message: transAssistants("add-success", {
                        assistantName: assistant.name,
                      }),
                      type: "success",
                    });
                    router.refresh();
                  } else {
                    setPopup({
                      message: transAssistants("add-fail", {
                        assistantName: assistant.name,
                      }),
                      type: "error",
                    });
                  }
                }}
              >
                <FiPlus /> {transGeneral("add")}
              </div>
            ),
          ]}
        </DefaultPopover>
      </div>
    </>
  );
}

interface AssistantsListProps {
  user: User | null;
  assistants: Persona[];
}

export function AssistantsList({ user, assistants }: AssistantsListProps) {
  const filteredAssistants = orderAssistantsForUser(assistants, user);
  const ownedButHiddenAssistants = assistants.filter(
    (assistant) =>
      checkUserOwnsAssistant(user, assistant) &&
      user?.preferences?.chosen_assistants &&
      !user?.preferences?.chosen_assistants?.includes(assistant.id)
  );
  const allAssistantIds = assistants.map((assistant) => assistant.id);

  const { popup, setPopup } = usePopup();

  const { data: users } = useSWR<MinimalUserSnapshot[]>(
    "/api/users",
    errorHandlingFetcher
  );
  const transAssistants = useTranslations("assistants");
  return (
    <>
      {popup}
      <div className="mx-auto w-searchbar-xs 2xl:w-searchbar-sm 3xl:w-searchbar">
        <AssistantsPageTitle>
          {transAssistants("my-assistants")}
        </AssistantsPageTitle>

        <div className="grid grid-cols-2 gap-4 mt-3">
          <Link href="/assistants/new">
            <NavigationButton>
              <div className="flex justify-center">
                <FiPlus className="mr-2 my-auto" size={20} />
                {transAssistants("create-new-assistant")}
              </div>
            </NavigationButton>
          </Link>

          <Link href="/assistants/gallery">
            <NavigationButton>
              <div className="flex justify-center">
                <FiSearch className="mr-2 my-auto" size={20} />
                {transAssistants("view-available-assistants")}
              </div>
            </NavigationButton>
          </Link>
        </div>

        <p className="mt-6 text-center text-base">
          {transAssistants("assistants-msg")}
        </p>

        <Divider />

        <h3 className="text-xl font-bold mb-4">
          {transAssistants("active-assistants-title")}
        </h3>

        <Text>{transAssistants("active-assistants-msg")}</Text>

        <div className="w-full p-4 mt-3">
          {filteredAssistants.map((assistant, index) => (
            <AssistantListItem
              key={assistant.id}
              assistant={assistant}
              user={user}
              allAssistantIds={allAssistantIds}
              allUsers={users || []}
              isFirst={index === 0}
              isLast={index === filteredAssistants.length - 1}
              isVisible
              setPopup={setPopup}
            />
          ))}
        </div>

        {ownedButHiddenAssistants.length > 0 && (
          <>
            <Divider />

            <h3 className="text-xl font-bold mb-4">
              {transAssistants("hidden-assistants-title")}
            </h3>

            <Text>{transAssistants("hidden-assistants-msg")}</Text>

            <div className="w-full p-4">
              {ownedButHiddenAssistants.map((assistant, index) => (
                <AssistantListItem
                  key={assistant.id}
                  assistant={assistant}
                  user={user}
                  allAssistantIds={allAssistantIds}
                  allUsers={users || []}
                  isFirst={index === 0}
                  isLast={index === filteredAssistants.length - 1}
                  isVisible={false}
                  setPopup={setPopup}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
