import "@/app/globals.css";

import {
  fetchEnterpriseSettingsSS,
  fetchSettingsSS,
  SettingsError,
} from "@/components/settings/lib";
import {
  CUSTOM_ANALYTICS_ENABLED,
  SERVER_SIDE_ONLY__PAID_ENTERPRISE_FEATURES_ENABLED,
} from "@/lib/constants";
import { SettingsProvider } from "@/components/settings/SettingsProvider";
import { Metadata } from "next";
import { buildClientUrl } from "@/lib/utilsSS";
import { Inter } from "next/font/google";
import Head from "next/head";
import { EnterpriseSettings } from "./admin/settings/interfaces";
import { redirect } from "next/navigation";
import { Button, Card } from "@tremor/react";
import LogoType from "@/components/header/LogoType";
import { HeaderTitle } from "@/components/header/HeaderTitle";
import { Logo } from "@/components/Logo";
import { UserProvider } from "@/components/user/UserProvider";
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
    description: "Question answering for your documents",
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
  const combinedSettings = await fetchSettingsSS();
  if (!combinedSettings) {
    // Just display a simple full page error if fetching fails.

    return (
      <html lang="en" className={`${inter.variable} font-sans`}>
        <Head>
          <title>Settings Unavailable | Danswer</title>
        </Head>
        <body className="bg-background text-default">
          <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="mb-2 flex items-center max-w-[175px]">
              <HeaderTitle>Danswer</HeaderTitle>
              <Logo height={40} width={40} />
            </div>

            <Card className="p-8 max-w-md">
              <h1 className="text-2xl font-bold mb-4 text-error">Error</h1>
              <p className="text-text-500">
                Your Danswer instance was not configured properly and your
                settings could not be loaded. Please contact your admin to fix
                this error.
              </p>
            </Card>
          </div>
        </body>
      </html>
    );
  }
  var messages = {};

  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {}

  return (
    <html lang={locale}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, interactive-widget=resizes-content"
        />
      </Head>

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

      <body className={`relative ${inter.variable} font-sans`}>
        <div
          className={`text-default bg-background ${
            // TODO: remove this once proper dark mode exists
            process.env.THEME_IS_DARK?.toLowerCase() === "true" ? "dark" : ""
          }`}
        >
          <UserProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
          <SettingsProvider settings={combinedSettings}>
                {children}
              </SettingsProvider>
          </UserProvider>
        </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
