"use client";

import { CombinedSettings } from "@/app/[locale]/admin/settings/interfaces";
import { createContext, ReactNode, useContext } from "react";

export const SettingsContext = createContext<CombinedSettings | null>(null);

type SettingsProviderProps = {
  children: ReactNode;
  settings: CombinedSettings;
};

// Create the SettingsProvider component
export const SettingsProvider = ({
  children,
  settings,
}: SettingsProviderProps): JSX.Element => {
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};

// Helper hook to use the settings context
export const useSettings = (): CombinedSettings | null => {
  return useContext(SettingsContext);
};
