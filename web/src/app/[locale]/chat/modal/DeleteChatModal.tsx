import { FiTrash, FiX } from "react-icons/fi";
import { ModalWrapper } from "./ModalWrapper";
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
          <h2 className="my-auto text-2xl font-bold">
            {transChat("delete-chat")}
          </h2>
          <div
            onClick={onClose}
            className="my-auto ml-auto p-2 hover:bg-hover rounded cursor-pointer"
          >
            <FiX size={20} />
          </div>
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
