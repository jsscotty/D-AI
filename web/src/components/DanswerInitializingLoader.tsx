import { Bold } from "@tremor/react";
import { Logo } from "./Logo";
import { useContext } from "react";
import { SettingsContext } from "./settings/SettingsProvider";
import { useTranslations } from "next-intl";

export function DanswerInitializingLoader() {
  const settings = useContext(SettingsContext);
  const transWelcome = useTranslations("general");
  return (
    <div className="mx-auto my-auto animate-pulse">
      <Logo height={96} width={96} className="mx-auto mb-3" />
      <Bold>
        {transWelcome("initializing")}{" "}
        {settings?.enterpriseSettings?.application_name ?? "Blona"}
      </Bold>
    </div>
  );
}
