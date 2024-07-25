import { DanswerDocument } from "@/lib/search/interfaces";
import { Divider, Text } from "@tremor/react";
import { ChatDocumentDisplay } from "./ChatDocumentDisplay";
import { usePopup } from "@/components/admin/connectors/Popup";
import { FiAlertTriangle, FiFileText } from "react-icons/fi";
import { SelectedDocumentDisplay } from "./SelectedDocumentDisplay";
import { removeDuplicateDocs } from "@/lib/documentUtils";
import { BasicSelectable } from "@/components/BasicClickable";
import { Message, RetrievalType } from "../interfaces";
import { SIDEBAR_WIDTH } from "@/lib/constants";
import { HoverPopup } from "@/components/HoverPopup";
import { TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { ForwardedRef, forwardRef } from "react";
import { useTranslations } from "next-intl";

function SectionHeader({
  name,
  icon,
  closeHeader,
}: {
  name: string;
  icon: React.FC<{ className: string }>;
  closeHeader?: () => void;
}) {
  return (
    <div
      className={`w-full mt-3 flex text-lg text-emphasis font-medium flex mb-3.5 font-bold flex items-end`}
    >
      <div className="flex mt-auto justify-between w-full">
        <p className="flex">
          {icon({ className: "my-auto mr-1" })}
          {name}
        </p>
        {closeHeader && (
          <button onClick={() => closeHeader()}>
            <TbLayoutSidebarLeftExpand size={24} />
          </button>
        )}
      </div>
    </div>
  );
}

interface DocumentSidebarProps {
  closeSidebar: () => void;
  selectedMessage: Message | null;
  selectedDocuments: DanswerDocument[] | null;
  toggleDocumentSelection: (document: DanswerDocument) => void;
  clearSelectedDocuments: () => void;
  selectedDocumentTokens: number;
  maxTokens: number;
  isLoading: boolean;
  initialWidth: number;
  isOpen: boolean;
}

export const DocumentSidebar = forwardRef<HTMLDivElement, DocumentSidebarProps>(
  (
    {
      closeSidebar,
      selectedMessage,
      selectedDocuments,
      toggleDocumentSelection,
      clearSelectedDocuments,
      selectedDocumentTokens,
      maxTokens,
      isLoading,
      initialWidth,
      isOpen,
    },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const { popup, setPopup } = usePopup();

    const selectedMessageRetrievalType = selectedMessage?.retrievalType || null;

    const selectedDocumentIds =
      selectedDocuments?.map((document) => document.document_id) || [];

    const currentDocuments = selectedMessage?.documents || null;
    const dedupedDocuments = removeDuplicateDocs(currentDocuments || []);

    // NOTE: do not allow selection if less than 75 tokens are left
    // this is to prevent the case where they are able to select the doc
    // but it basically is unused since it's truncated right at the very
    // start of the document (since title + metadata + misc overhead) takes up
    // space
    const tokenLimitReached = selectedDocumentTokens > maxTokens - 75;
    const trans = useTranslations("chat");

    return (
      <div
        className={`fixed inset-0 transition-opacity duration-300 z-50 bg-black/80 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            closeSidebar();
          }
        }}
      >
        <div
          className={`ml-auto rounded-l-lg relative border-l bg-text-100 sidebar z-50 absolute right-0 h-screen transition-all duration-300 ${
            isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[10%]"
          }`}
          ref={ref}
          style={{
            width: initialWidth,
          }}
        >
          <div className="pb-6 flex-initial overflow-y-hidden flex flex-col h-screen ">
            {popup}
            <div className="pl-3 mx-2 pr-6 mt-3 flex text-text-800 flex-col text-2xl text-emphasis flex font-semibold">
              {dedupedDocuments.length} {trans("documents")}
              <p className="text-sm font-semibold flex flex-wrap gap-x-2 text-text-600 mt-1">
                {trans("documents-msg")}
                <a
                  href="mailto:sebastian@blona.de"
                  className="underline cursor-pointer hover:text-strong"
                >
                  {trans("learn-more")}
                </a>
              </p>
            </div>

            <Divider className="mb-0 mt-4 pb-2" />

            {currentDocuments ? (
              <div className="overflow-y-auto flex-grow dark-scrollbar flex relative flex-col">
                <div>
                  {dedupedDocuments.length > 0 ? (
                    dedupedDocuments.map((document, ind) => (
                      <div
                        key={document.document_id}
                        className={`${
                          ind === dedupedDocuments.length - 1
                            ? "mb-5"
                            : "border-b  border-border-light mb-3"
                        }`}
                      >
                        <ChatDocumentDisplay
                          document={document}
                          setPopup={setPopup}
                          queryEventId={null}
                          isAIPick={false}
                          isSelected={selectedDocumentIds.includes(
                            document.document_id
                          )}
                          handleSelect={(documentId) => {
                            toggleDocumentSelection(
                              dedupedDocuments.find(
                                (document) =>
                                  document.document_id === documentId
                              )!
                            );
                          }}
                          tokenLimitReached={tokenLimitReached}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="mx-3">
                      <Text> {trans("no-documents-found")}</Text>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              !isLoading && (
                <div className="ml-4 mr-3">
                  <Text>{trans("documents-question")}</Text>
                </div>
              )
            )}
          </div>

          <div className="absolute left-0 bottom-0 w-full bg-gradient-to-b from-neutral-100/0 via-neutral-100/40 backdrop-blur-xs to-neutral-100 h-[100px]" />
          <div className="sticky bottom-4 w-full left-0 justify-center flex gap-x-4">
            <button
              className="bg-[#84e49e] text-xs p-2 rounded text-text-800"
              onClick={() => closeSidebar()}
            >
              {trans("save-changes")}
            </button>

            <button
              className="bg-error text-xs p-2 rounded text-text-200"
              onClick={() => {
                clearSelectedDocuments();

                closeSidebar();
              }}
            >
              {trans("delete-context")}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

DocumentSidebar.displayName = "DocumentSidebar";
