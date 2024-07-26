"use client";

import React from "react";
import { useContext } from "react";
import { SettingsContext } from "@/components/settings/SettingsProvider";
import { useTranslations } from "next-intl";

export const LoginText = () => {
  const settings = useContext(SettingsContext);
  const trans = useTranslations("auth");

  if (!settings) {
    throw new Error("SettingsContext is not available");
  }

  return (
    <>
      {trans("log-in")} {trans("to")}{" "}
      {settings?.enterpriseSettings?.application_name || "Blona"}
    </>
  );
};
