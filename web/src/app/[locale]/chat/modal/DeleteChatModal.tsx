import { FiTrash, FiX } from "react-icons/fi";
import { ModalWrapper } from "@/components/modals/ModalWrapper";
import { BasicClickable } from "@/components/BasicClickable";
import { useTranslations } from "next-intl";
export const DeleteChatModal = ({
  chatSessionName,
  onClose,
  onSubmit,
}: {
  chatSessionName: string;
  onClose: () => void;
  onSubmit: () => void;
}) => {
  const transGeneral = useTranslations("general");
  const transChat = useTranslations("chat");
  return (
    <ModalWrapper onClose={onClose}>
      <>
        <div className="flex mb-4">
<<<<<<< HEAD:web/src/app/[locale]/chat/modal/DeleteChatModal.tsx
          <h2 className="my-auto text-2xl font-bold">
            {transChat("delete-chat")}
          </h2>
          <div
            onClick={onClose}
            className="my-auto ml-auto p-2 hover:bg-hover rounded cursor-pointer"
          >
            <FiX size={20} />
          </div>
=======
          <h2 className="my-auto text-2xl font-bold">Delete chat?</h2>
>>>>>>> c0e1a02e8edf16c4c4874a9c2eb739cccbdc20d1:web/src/app/chat/modal/DeleteChatModal.tsx
        </div>
        <p className="mb-4">
          {transChat("delete-confirm")}{" "}
          <b>&quot;{chatSessionName.slice(0, 30)}&quot;</b>
        </p>
        <div className="flex">
          <div className="mx-auto">
            <BasicClickable onClick={onSubmit}>
              <div className="flex mx-2">
                <FiTrash className="my-auto mr-2" />
                {transGeneral("delete")}
              </div>
            </BasicClickable>
          </div>
        </div>
      </>
    </ModalWrapper>
  );
};
