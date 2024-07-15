import { Form, Formik } from "formik";
import * as Yup from "yup";
import { PopupSpec } from "@/components/admin/connectors/Popup";
import { ConnectorIndexingStatus, User, UserGroup } from "@/lib/types";
import { TextFormField } from "@/components/admin/connectors/Field";
import { ConnectorTitle } from "@/components/admin/connectors/ConnectorTitle";
import { createUserGroup } from "./lib";
import { UserEditor } from "./UserEditor";
import { ConnectorEditor } from "./ConnectorEditor";
import { Modal } from "@/components/Modal";
import { XIcon } from "@/components/icons/icons";
import { Button, Divider } from "@tremor/react";

interface UserGroupCreationFormProps {
  onClose: () => void;
  setPopup: (popupSpec: PopupSpec | null) => void;
  users: User[];
  ccPairs: ConnectorIndexingStatus<any, any>[];
  existingUserGroup?: UserGroup;
}

export const UserGroupCreationForm = ({
  onClose,
  setPopup,
  users,
  ccPairs,
  existingUserGroup,
}: UserGroupCreationFormProps) => {
  const isUpdate = existingUserGroup !== undefined;

  return (
    <Modal onOutsideClick={onClose}>
      <div className="px-8 py-6 bg-background">
        <h2 className="text-xl font-bold flex">
          {isUpdate ? "Nutzergruppe aktualisieren" : "Neue Nutzergruppe erstellen"}
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
            name: existingUserGroup ? existingUserGroup.name : "",
            user_ids: [] as string[],
            cc_pair_ids: [] as number[],
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required("Name für die Gruppe eingeben"),
            user_ids: Yup.array().of(Yup.string().required()),
            cc_pair_ids: Yup.array().of(Yup.number().required()),
          })}
          onSubmit={async (values, formikHelpers) => {
            formikHelpers.setSubmitting(true);
            let response;
            response = await createUserGroup(values);
            formikHelpers.setSubmitting(false);
            if (response.ok) {
              setPopup({
                message: isUpdate
                  ? "Nutzergruppe erfolgreich aktualisiert!"
                  : "Nutzergruppe erfolgreich erstellt!",
                type: "success",
              });
              onClose();
            } else {
              const responseJson = await response.json();
              const errorMsg = responseJson.detail || responseJson.message;
              setPopup({
                message: isUpdate
                  ? `Fehler beim Aktualisieren der Nutzergruppe - ${errorMsg}`
                  : `Fehler beim Erstellen der Nutzergruppe - ${errorMsg}`,
                type: "error",
              });
            }
          }}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <div className="p-4">
                <TextFormField
                  name="name"
                  label="Name:"
                  placeholder="Name der Nutzergruppe"
                  disabled={isUpdate}
                  autoCompleteDisabled={true}
                />

                <Divider />

                <h2 className="mb-1 font-medium">
                  Wähle die Datenquellen, zu denen diese Gruppe Zugriff hat:
                </h2>
                <p className="mb-3 text-xs">
                  Alle Dokumente in den ausgewählten Quellen sind für die Nutzergruppe zugänglich. 
                </p>

                <ConnectorEditor
                  allCCPairs={ccPairs}
                  selectedCCPairIds={values.cc_pair_ids}
                  setSetCCPairIds={(ccPairsIds) =>
                    setFieldValue("cc_pair_ids", ccPairsIds)
                  }
                />

                <Divider />

                <h2 className="mb-1 font-medium">
                  Wähle aus, welche Benutzer Teil dieser Gruppe sein sollen.
                </h2>
                <p className="mb-3 text-xs">
                  Alle ausgewählten Benutzer können in allen von den ausgewählten Connectors indizierten Dokumenten suchen.
                </p>
                <div className="mb-3 gap-2">
                  <UserEditor
                    selectedUserIds={values.user_ids}
                    setSelectedUserIds={(userIds) =>
                      setFieldValue("user_ids", userIds)
                    }
                    allUsers={users}
                    existingUsers={[]}
                  />
                </div>
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
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};
