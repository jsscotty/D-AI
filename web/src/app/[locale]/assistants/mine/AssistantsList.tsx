"use client";

import { useState } from "react";
import { MinimalUserSnapshot, User } from "@/lib/types";
import { Persona } from "@/app/[locale]/admin/assistants/interfaces";
import { Divider, Text } from "@tremor/react";
import { FiEdit2, FiPlus, FiSearch, FiShare2 } from "react-icons/fi";
import Link from "next/link";
import { orderAssistantsForUser } from "@/lib/assistants/orderAssistants";
import { updateUserAssistantList } from "@/lib/assistants/updateAssistantPreferences";
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
<<<<<<< HEAD:web/src/app/[locale]/assistants/mine/AssistantsList.tsx
import { ToolsDisplay } from "../ToolsDisplay";
import { useTranslations } from "next-intl";
=======
import { AssistantTools } from "../ToolsDisplay";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { DragHandle } from "@/components/table/DragHandle";

function DraggableAssistantListItem(props: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.assistant.id.toString() });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    opacity: isDragging ? 0.9 : 1,
    zIndex: isDragging ? 1000 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center">
      <div {...attributes} {...listeners} className="mr-2 cursor-grab">
        <DragHandle />
      </div>
      <div className="flex-grow">
        <AssistantListItem {...props} />
      </div>
    </div>
  );
}
>>>>>>> c0e1a02e8edf16c4c4874a9c2eb739cccbdc20d1:web/src/app/assistants/mine/AssistantsList.tsx

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
  allAssistantIds: string[];
  isFirst: boolean;
  isLast: boolean;
  isVisible: boolean;
  setPopup: (popupSpec: PopupSpec | null) => void;
}) {
  const router = useRouter();
  const [showSharingModal, setShowSharingModal] = useState(false);

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
        className="flex bg-background-emphasis
          rounded-lg
          shadow-md
          p-4
          mb-4 flex-col"
      >
        <div
          className="
          flex
          justify-between
          items-center
        "
        >
<<<<<<< HEAD:web/src/app/[locale]/assistants/mine/AssistantsList.tsx
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
=======
          <div className="w-3/4">
            <div className="flex items-center">
              <AssistantIcon assistant={assistant} />
              <h2 className="text-xl line-clamp-2 font-semibold my-auto ml-2">
                {assistant.name}
              </h2>
            </div>

            <div className="text-sm mt-2">{assistant.description}</div>
            <div className="mt-2 flex items-start gap-y-2 flex-col gap-x-3">
              <AssistantSharedStatusDisplay assistant={assistant} user={user} />
              {assistant.tools.length != 0 && (
                <AssistantTools list assistant={assistant} />
              )}
            </div>
          </div>

          {isOwnedByUser && (
            <div className="ml-auto flex items-center">
              {!assistant.is_public && (
                <div
                  className="mr-4 rounded p-2 cursor-pointer hover:bg-hover"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSharingModal(true);
                  }}
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
        </div>
>>>>>>> c0e1a02e8edf16c4c4874a9c2eb739cccbdc20d1:web/src/app/assistants/mine/AssistantsList.tsx
      </div>
    </>
  );
}
export function AssistantsList({
  user,
  assistants,
}: {
  user: User | null;
  assistants: Persona[];
}) {
  const [filteredAssistants, setFilteredAssistants] = useState(
    orderAssistantsForUser(assistants, user)
  );

  const ownedButHiddenAssistants = assistants.filter(
    (assistant) =>
      checkUserOwnsAssistant(user, assistant) &&
      user?.preferences?.chosen_assistants &&
      !user?.preferences?.chosen_assistants?.includes(assistant.id)
  );
  const allAssistantIds = assistants.map((assistant) =>
    assistant.id.toString()
  );

  const { popup, setPopup } = usePopup();

  const { data: users } = useSWR<MinimalUserSnapshot[]>(
    "/api/users",
    errorHandlingFetcher
  );
<<<<<<< HEAD:web/src/app/[locale]/assistants/mine/AssistantsList.tsx
  const transAssistants = useTranslations("assistants");
  return (
    <>
      {popup}
      <div className="mx-auto w-searchbar-xs 2xl:w-searchbar-sm 3xl:w-searchbar">
        <AssistantsPageTitle>
          {transAssistants("my-assistants")}
        </AssistantsPageTitle>
=======

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setFilteredAssistants((assistants) => {
        const oldIndex = assistants.findIndex(
          (a) => a.id.toString() === active.id
        );
        const newIndex = assistants.findIndex(
          (a) => a.id.toString() === over.id
        );
        const newAssistants = arrayMove(assistants, oldIndex, newIndex);

        updateUserAssistantList(newAssistants.map((a) => a.id));
        return newAssistants;
      });
    }
  }

  return (
    <>
      {popup}
      <div className="mx-auto mobile:w-[90%] desktop:w-searchbar-xs 2xl:w-searchbar-sm 3xl:w-searchbar">
        <AssistantsPageTitle>My Assistants</AssistantsPageTitle>
>>>>>>> c0e1a02e8edf16c4c4874a9c2eb739cccbdc20d1:web/src/app/assistants/mine/AssistantsList.tsx

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

<<<<<<< HEAD:web/src/app/[locale]/assistants/mine/AssistantsList.tsx
        <Text>{transAssistants("active-assistants-msg")}</Text>
=======
        <Text>
          The order the assistants appear below will be the order they appear in
          the Assistants dropdown. The first assistant listed will be your
          default assistant when you start a new chat. Drag and drop to reorder.
        </Text>
>>>>>>> c0e1a02e8edf16c4c4874a9c2eb739cccbdc20d1:web/src/app/assistants/mine/AssistantsList.tsx

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredAssistants.map((a) => a.id.toString())}
            strategy={verticalListSortingStrategy}
          >
            <div className="w-full p-4 mt-3">
              {filteredAssistants.map((assistant, index) => (
                <DraggableAssistantListItem
                  key={assistant.id}
                  assistant={assistant}
                  user={user}
                  allAssistantIds={allAssistantIds}
                  allUsers={users || []}
                  isFirst={false}
                  isLast={index === filteredAssistants.length - 1}
                  isVisible
                  setPopup={setPopup}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

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
                  isLast={index === ownedButHiddenAssistants.length - 1}
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
