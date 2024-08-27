"use client";
import { SourceIcon } from "@/components/SourceIcon";
import { AdminPageTitle } from "@/components/admin/Title";
import { ConnectorIcon } from "@/components/icons/icons";
import { SourceCategory, SourceMetadata } from "@/lib/search/interfaces";
import { listSourceMetadata } from "@/lib/sources";
import { Title, Text, Button } from "@tremor/react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "@next-intl";

function SourceTile({
  sourceMetadata,
  preSelect,
}: {
  sourceMetadata: SourceMetadata;
  preSelect?: boolean;
}) {
  return (
    <Link
      className={`flex 
        flex-col 
        items-center 
        justify-center 
        p-4 
        rounded-lg 
        w-40 
        cursor-pointer
        shadow-md
        hover:bg-hover
        ${preSelect ? "bg-hover subtle-pulse" : "bg-hover-light"}
      `}
      href={sourceMetadata.adminUrl}
    >
      <SourceIcon sourceType={sourceMetadata.internalName} iconSize={24} />
      <Text className="font-medium text-sm mt-2">
        {sourceMetadata.displayName}
      </Text>
    </Link>
  );
}
export default function Page() {
  const sources = useMemo(() => listSourceMetadata(), []);
  const [searchTerm, setSearchTerm] = useState("");

  const importedKnowledgeSources = sources.filter(
    (source) => source.category === SourceCategory.ImportedKnowledge
  );
  const appConnectionSources = sources.filter(
    (source) => source.category === SourceCategory.AppConnection
  );

  return (
    <div className="mx-auto container">
      <AdminPageTitle
        icon={<ConnectorIcon size={32} />}
        title="Add Connector"
      />

      <Text>
        Connect Danswer to your organization&apos;s knowledge sources.
        We&apos;ll automatically sync your data into Danswer, so you can find
        exactly what you&apos;re looking for in one place.
      </Text>

      <div className="flex mt-8">
        <Title>Import Knowledge</Title>
      </div>
      <Text>
        Connect to pieces of knowledge that live outside your apps. Upload
        files, scrape websites, or connect to your organization&apos;s Google
        Site.
      </Text>
      <div className="flex flex-wrap gap-4 p-4">
        {importedKnowledgeSources.map((source) => {
          return (
            <SourceTile key={source.internalName} sourceMetadata={source} />
          );
        })}
      </div>

      <div className="flex mt-8">
        <Title>Setup Auto-Syncing from Apps</Title>
      </div>
      <Text>
        Setup auto-syncing from your organization&apos;s most used apps and
        services. Unless otherwise specified during the connector setup, we will
        pull in the latest updates from the source every 10 minutes.
      </Text>
      <div className="flex flex-wrap gap-4 p-4">
        {appConnectionSources.map((source) => {
          return (
            <SourceTile key={source.internalName} sourceMetadata={source} />
          );
        })}
      </div>
    </div>
  );
}

function getCategoryDescription(category: SourceCategory): string {
  switch (category) {
    case SourceCategory.Messaging:
      return "Integrate with messaging and communication platforms.";
    case SourceCategory.ProjectManagement:
      return "Link to project management and task tracking tools.";
    case SourceCategory.CustomerSupport:
      return "Connect to customer support and helpdesk systems.";
    case SourceCategory.CodeRepository:
      return "Integrate with code repositories and version control systems.";
    case SourceCategory.Storage:
      return "Connect to cloud storage and file hosting services.";
    case SourceCategory.Wiki:
      return "Link to wiki and knowledge base platforms.";
    case SourceCategory.Other:
      return "Connect to other miscellaneous knowledge sources.";
    default:
      return "Connect to various knowledge sources.";
  }
}
