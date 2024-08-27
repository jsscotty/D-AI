import { Form, Formik } from "formik";
import { PopupSpec } from "@/components/admin/connectors/Popup";
import {
  BooleanFormField,
  TextFormField,
} from "@/components/admin/connectors/Field";
import { createApiKey, updateApiKey } from "./lib";
import { Modal } from "@/components/Modal";
import { XIcon } from "@/components/icons/icons";
import { Button, Divider, Text } from "@tremor/react";
import { useTranslations } from "next-intl";
import { UserRole } from "@/lib/types";
import { APIKey } from "./types";

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
  const transWelcome = useTranslations("api");


  return (
    <Modal onOutsideClick={onClose} width="w-2/6">
      <div className="px-8 py-6 bg-background">
        <h2 className="text-xl font-bold flex">
          {isUpdate ? transWelcome("Update") : transWelcome("Create")}
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
            is_admin: apiKey?.api_key_role === "admin",
          }}
          onSubmit={async (values, formikHelpers) => {
            formikHelpers.setSubmitting(true);

            // Map the boolean to a UserRole string
            const role: UserRole = values.is_admin
              ? UserRole.ADMIN
              : UserRole.BASIC;

            // Prepare the payload with the UserRole
            const payload = {
              ...values,
              role, // Assign the role directly as a UserRole type
            };

            let response;
            if (isUpdate) {
              response = await updateApiKey(apiKey.api_key_id, payload);
            } else {
              response = await createApiKey(payload);
            }
            formikHelpers.setSubmitting(false);
            if (response.ok) {
              setPopup({
                message: isUpdate
                  ? ({transWelcome("Update_Success")})
                  : ({transWelcome("Create_Success")}),
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
                  ? (transWelcome("Update_Error") - ,{errorMsg})
                  : (transWelcome("Create_Error") - ,{errorMsg}),
                type: "error",
              });
            }
          }}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <Text className="mb-4 text-lg">
              {transWelcome("API_Name")}
              </Text>

              <TextFormField
                name="name"
                label="Name (optional):"
                autoCompleteDisabled={true}
              />

              <BooleanFormField
                small
                noPadding
                alignTop
                name="is_admin"
                label="Is Admin?"
                subtext="If set, this API key will have access to admin level server API's."
              />

              <div className="flex">
                <Button
                  type="submit"
                  size="xs"
                  color="green"
                  disabled={isSubmitting}
                  className="mx-auto w-64"
                >
                  {isUpdate ? "Update!" : "Create!"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};
