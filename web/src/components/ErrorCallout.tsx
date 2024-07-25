import { Callout } from "@tremor/react";
import { FiAlertOctagon } from "react-icons/fi";
import { useTranslations } from "next-intl";



export function ErrorCallout({
  errorTitle,
  errorMsg,
}: {
  errorTitle?: string;
  errorMsg?: string;
}) {
  
  return (
    const transWelcome = useTranslations("general");
    <div>
      <Callout
        className="mt-4"
        title={errorTitle || transWelcome("page-not-found")}
        icon={FiAlertOctagon}
        color="rose"
      >
        {errorMsg}
      </Callout>
    </div>
  );
}
