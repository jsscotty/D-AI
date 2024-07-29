"use client";

import { ThreeDotsLoader } from "@/components/Loading";
import { AdminPageTitle } from "@/components/admin/Title";
import { KeyIcon } from "@/components/icons/icons";
import { errorHandlingFetcher } from "@/lib/fetcher";
import { ErrorCallout } from "@/components/ErrorCallout";
import useSWR, { mutate } from "swr";
import {
  Button,
  Divider,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  Title,
} from "@tremor/react";
import { usePopup } from "@/components/admin/connectors/Popup";
import { useState } from "react";
import { Table } from "@tremor/react";
import { DeleteButton } from "@/components/DeleteButton";
import { FiCopy, FiEdit2, FiRefreshCw, FiX } from "react-icons/fi";
import { Modal } from "@/components/Modal";
import { Spinner } from "@/components/Spinner";
import { deleteApiKey, regenerateApiKey } from "./lib";
import { DanswerApiKeyForm } from "./DanswerApiKeyForm";
import { useTranslations } from "next-intl";

const transWelcome = useTranslations("api");
const API_KEY_TEXT = ({transWelcome("api_desc")});


function NewApiKeyModal({
  apiKey,
  onClose,
}: {
  apiKey: string;
  onClose: () => void;
}) {
  const [copyClicked, setCopyClicked] = useState(false);

  return (
    <Modal onOutsideClick={onClose}>
      <div className="px-8 py-8">
        <div className="flex w-full border-b border-border mb-4 pb-4">
          <Title>{transWelcome("new_key")}</Title>
          <div onClick={onClose} className="ml-auto p-1 rounded hover:bg-hover">
            <FiX size={18} />
          </div>
        </div>
        <div className="h-32">
          <Text className="mb-4">
          {transWelcome("new_key_desc")}
          </Text>

          <div className="flex mt-2">
            <b className="my-auto break-all">{apiKey}</b>
            <div
              className="ml-2 my-auto p-2 hover:bg-hover rounded cursor-pointer"
              onClick={() => {
                setCopyClicked(true);
                navigator.clipboard.writeText(apiKey);
                setTimeout(() => {
                  setCopyClicked(false);
                }, 10000);
              }}
            >
              <FiCopy size="16" className="my-auto" />
            </div>
          </div>
          {copyClicked && (
            <Text className="text-success text-xs font-medium mt-1">
              {transWelcome("key_copied")}
            </Text>
          )}
        </div>
      </div>
    </Modal>
  );
}

function Main() {
  const { popup, setPopup } = usePopup();

  const {
    data: apiKeys,
    isLoading,
    error,
  } = useSWR<APIKey[]>("/api/admin/api-key", errorHandlingFetcher);

  const [fullApiKey, setFullApiKey] = useState<string | null>(null);
  const [keyIsGenerating, setKeyIsGenerating] = useState(false);
  const [showCreateUpdateForm, setShowCreateUpdateForm] = useState(false);
  const [selectedApiKey, setSelectedApiKey] = useState<APIKey | undefined>();

  const handleEdit = (apiKey: APIKey) => {
    setSelectedApiKey(apiKey);
    setShowCreateUpdateForm(true);
  };

  if (isLoading) {
    return <ThreeDotsLoader />;
  }

  if (!apiKeys || error) {
    return (
      <ErrorCallout
        errorTitle={transWelcome("api_fetch_fail")}
        errorMsg={error?.info?.detail || error.toString()}
      />
    );
  }

  const newApiKeyButton = (
    <Button
      color="green"
      size="xs"
      className="mt-3"
      onClick={() => setShowCreateUpdateForm(true)}
    >
      {transWelcome("create_another")}
    </Button>
  );

  if (apiKeys.length === 0) {
    return (
      <div>
        {popup}
        <Text>{API_KEY_TEXT}</Text>
        {newApiKeyButton}

        {showCreateUpdateForm && (
          <DanswerApiKeyForm
            onCreateApiKey={(apiKey) => {
              setFullApiKey(apiKey.api_key);
            }}
            onClose={() => {
              setShowCreateUpdateForm(false);
              setSelectedApiKey(undefined);
              mutate("/api/admin/api-key");
            }}
            setPopup={setPopup}
            apiKey={selectedApiKey}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      {popup}

      {fullApiKey && (
        <NewApiKeyModal
          apiKey={fullApiKey}
          onClose={() => setFullApiKey(null)}
        />
      )}

      {keyIsGenerating && <Spinner />}

      <Text>{API_KEY_TEXT}</Text>
      {newApiKeyButton}

      <Divider />

      <Title className="mt-6">{transWelcome("existing_keys")}</Title>
      <Table className="overflow-visible">
        <TableHead>
          <TableRow>
            <TableHeaderCell>{transWelcome("name")}</TableHeaderCell>
            <TableHeaderCell>{transWelcome("api_key")}</TableHeaderCell>
            <TableHeaderCell>{transWelcome("regenerate")}</TableHeaderCell>
            <TableHeaderCell>{transWelcome("delete")}</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {apiKeys.map((apiKey) => (
            <TableRow key={apiKey.api_key_id}>
              <TableCell>
                <div
                  className={`
                  my-auto 
                  flex 
                  mb-1 
                  w-fit 
                  hover:bg-hover cursor-pointer
                  p-2 
                  rounded-lg
                  border-border
                  text-sm`}
                  onClick={() => handleEdit(apiKey)}
                >
                  <FiEdit2 className="my-auto mr-2" />
                  {apiKey.api_key_name || <i>null</i>}
                </div>
              </TableCell>
              <TableCell className="max-w-64">
                {apiKey.api_key_display}
              </TableCell>
              <TableCell>
                <div
                  className={`
                  my-auto 
                  flex 
                  mb-1 
                  w-fit 
                  hover:bg-hover cursor-pointer
                  p-2 
                  rounded-lg
                  border-border
                  text-sm`}
                  onClick={async () => {
                    setKeyIsGenerating(true);
                    const response = await regenerateApiKey(apiKey);
                    setKeyIsGenerating(false);
                    if (!response.ok) {
                      const errorMsg = await response.text();
                      setPopup({
                        type: "error",
                        message: `Failed to regenerate API Key: ${errorMsg}`,
                      });
                      return;
                    }
                    const newKey = (await response.json()) as APIKey;
                    setFullApiKey(newKey.api_key);
                    mutate("/api/admin/api-key");
                  }}
                >
                  <FiRefreshCw className="mr-1 my-auto" />
                  {transWelcome("refresh")}
                </div>
              </TableCell>
              <TableCell>
                <DeleteButton
                  onClick={async () => {
                    const response = await deleteApiKey(apiKey.api_key_id);
                    if (!response.ok) {
                      const errorMsg = await response.text();
                      setPopup({
                        type: "error",
                        message: ({transWelcome("failed_delete")}) ${errorMsg}),
                      });
                      return;
                    }
                    mutate("/api/admin/api-key");
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showCreateUpdateForm && (
        <DanswerApiKeyForm
          onCreateApiKey={(apiKey) => {
            setFullApiKey(apiKey.api_key);
          }}
          onClose={() => {
            setShowCreateUpdateForm(false);
            setSelectedApiKey(undefined);
            mutate("/api/admin/api-key");
          }}
          setPopup={setPopup}
          apiKey={selectedApiKey}
        />
      )}
    </div>
  );
}

export default function Page() {
  return (
    <div className="mx-auto container">
      <AdminPageTitle title={transWelcome("api_keys")} icon={<KeyIcon size={32} />} />

      <Main />
    </div>
  );
}
