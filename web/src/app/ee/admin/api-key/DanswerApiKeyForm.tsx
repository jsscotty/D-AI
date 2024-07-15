import { Form, Formik } from "formik";
import { PopupSpec } from "@/components/admin/connectors/Popup";
import { TextFormField } from "@/components/admin/connectors/Field";
import { createApiKey, updateApiKey } from "./lib";
import { Modal } from "@/components/Modal";
import { XIcon } from "@/components/icons/icons";
import { Button, Divider, Text } from "@tremor/react";

interface DanswerApiKeyFormProps {
  onClose: () => void;
  setPopup: (popupSpec: PopupSpec | null) => void;
  onCreateApiKey: (apiKey: APIKey) => void;
  apiKey?: APIKey;
}

export const DanswerApiKeyForm = ({
  onClose,
  setPopup,
  onCreateApiKey,
  apiKey,
}: DanswerApiKeyFormProps) => {
  const isUpdate = apiKey !== undefined;

  return (
    <Modal onOutsideClick={onClose} width="w-2/6">
      <div className="px-8 py-6 bg-background">
        <h2 className="text-xl font-bold flex">
          {isUpdate ? "API-Schlüssel aktualisieren" : "Neuen API-Schlüssel erstellen"}
          <div
            onClick={onClose}
            className="ml-auto hover:bg-hover p-1.5 rounded"
          >
            <XIcon
              size={20}
              className="my-auto flex flex-shrink-0 cursor-pointer"
            />
          </div>
        </h2>

        <Divider />

        <Formik
          initialValues={{
            name: apiKey?.api_key_name || "",
          }}
          onSubmit={async (values, formikHelpers) => {
            formikHelpers.setSubmitting(true);
            let response;
            if (isUpdate) {
              response = await updateApiKey(apiKey.api_key_id, values);
            } else {
              response = await createApiKey(values);
            }
            formikHelpers.setSubmitting(false);
            if (response.ok) {
              setPopup({
                message: isUpdate
                  ? "API-Schlüssel erfolgreich aktualisiert!"
                  : "API-Schlüssel erfolgreich erstellt!",
                type: "success",
              });
              if (!isUpdate) {
                onCreateApiKey(await response.json());
              }
              onClose();
            } else {
              const responseJson = await response.json();
              const errorMsg = responseJson.detail || responseJson.message;
              setPopup({
                message: isUpdate
                  ? `Fehler beim Aktualisieren des API-Schlüssels - ${errorMsg}`
                  : `Fehler beim Erstellen des API-Schlüssels - ${errorMsg}`,
                type: "error",
              });
            }
          }}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <Text className="mb-4 text-lg">
                Wählen Sie einen einprägsamen Namen für Ihren API-Schlüssel. Dies ist optional und kann später hinzugefügt oder geändert werden!
              </Text>

              <TextFormField
                name="name"
                label="Name (optional):"
                autoCompleteDisabled={true}
              />

              <div className="flex">
                <Button
                  type="submit"
                  size="xs"
                  color="green"
                  disabled={isSubmitting}
                  className="mx-auto w-64"
                >
                  {isUpdate ? "Aktualisieren!" : "Erstellen!"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};
