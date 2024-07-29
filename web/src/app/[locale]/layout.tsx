import "@/app/globals.css";

import { getCombinedSettings } from "@/components/settings/lib";
import { CUSTOM_ANALYTICS_ENABLED } from "@/lib/constants";
import { SettingsProvider } from "@/components/settings/SettingsProvider";
import { Metadata } from "next";
import { buildClientUrl } from "@/lib/utilsSS";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { useTranslations } from "next-intl";



const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const dynamicSettings = await getCombinedSettings({ forceRetrieval: true });
  const transWelcome = useTranslations("general");
  const logoLocation =
    dynamicSettings.enterpriseSettings &&
    dynamicSettings.enterpriseSettings?.use_custom_logo
      ? "/api/enterprise-settings/logo"
      : buildClientUrl("/blona.ico");

  return {
    title: dynamicSettings.enterpriseSettings?.application_name ?? "Blona",
    description: [{transWelcome("desc")}],
    icons: {
      icon: logoLocation,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const combinedSettings = await getCombinedSettings({});
  var messages = {};

  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {}

  return (
    <html lang={locale}>
      {CUSTOM_ANALYTICS_ENABLED && combinedSettings.customAnalyticsScript && (
        <head>
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: combinedSettings.customAnalyticsScript,
            }}
          />
           <link rel="icon" href="/favicon.ico" sizes="any" />
        </head>
      )}
      <body
        className={`${inter.variable} font-sans text-default bg-background ${
          // TODO: remove this once proper dark mode exists
          process.env.THEME_IS_DARK?.toLowerCase() === "true" ? "dark" : ""
        }`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SettingsProvider settings={combinedSettings}>
            {children}
          </SettingsProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
