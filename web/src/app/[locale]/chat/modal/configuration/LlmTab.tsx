import { useChatContext } from "@/components/context/ChatContext";
import { LlmOverride, LlmOverrideManager } from "@/lib/hooks";
import React, { forwardRef, useCallback, useRef, useState } from "react";
import { debounce } from "lodash";
import { DefaultDropdown } from "@/components/Dropdown";
import { Text } from "@tremor/react";
import { Persona } from "@/app/[locale]/admin/assistants/interfaces";
import { destructureValue, getFinalLLM, structureValue } from "@/lib/llm/utils";
import { updateModelOverrideForChatSession } from "../../lib";
import { useTranslations } from "next-intl";

interface LlmTabProps {
  llmOverrideManager: LlmOverrideManager;
  currentAssistant: Persona;
  chatSessionId?: number;
  close?: () => void;
}

export const LlmTab = forwardRef<HTMLDivElement, LlmTabProps>(
  ({ llmOverrideManager, currentAssistant, chatSessionId, close }, ref) => {
    const { llmProviders } = useChatContext();
    const { llmOverride, setLlmOverride, temperature, setTemperature } =
      llmOverrideManager;

    const [localTemperature, setLocalTemperature] = useState<number>(
      temperature || 0
    );

    const debouncedSetTemperature = useCallback(
      debounce((value) => {
        setTemperature(value);
      }, 300),
      []
    );

    const handleTemperatureChange = (value: number) => {
      setLocalTemperature(value);
      debouncedSetTemperature(value);
    };

    const [_, defaultLlmName] = getFinalLLM(
      llmProviders,
      currentAssistant,
      null
    );

    const llmOptions: { name: string; value: string }[] = [];
    llmProviders.forEach((llmProvider) => {
      llmProvider.model_names.forEach((modelName: any) => {
        llmOptions.push({
          name: modelName,
          value: structureValue(
            llmProvider.name,
            llmProvider.provider,
            modelName
          ),
        });
      });
    });
    const trans = useTranslations("chat");
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          {trans("choose-model")}
        </label>
        <Text className="mb-1">
          {trans("override-model", {
            assistantName: `<span class="font-medium">${currentAssistant.name}</span>`,
          })}
        </Text>
        <Text className="mb-3">
          {trans("default-model")}:{" "}
          <i className="font-medium">{defaultLlmName}</i>.
        </Text>

        <div ref={ref} className="w-96">
          <DefaultDropdown
            ref={ref}
            options={llmOptions}
            selected={structureValue(
              llmOverride.name,
              llmOverride.provider,
              llmOverride.modelName
            )}
            onSelect={(value) => {
              setLlmOverride(destructureValue(value as string));
              if (chatSessionId) {
                updateModelOverrideForChatSession(
                  chatSessionId,
                  value as string
                );
              }
            }}
          />
        </div>

        <label className="block text-sm font-medium mb-2 mt-4">
          {trans("temperature-title")}
        </label>

        <Text className="mb-8">{trans("temperature-msg")}</Text>

        <div className="relative w-full">
          <input
            type="range"
            onChange={(e) =>
              handleTemperatureChange(parseFloat(e.target.value))
            }
            className="
            w-full
            p-2
            border
            border-border
            rounded-md
          "
            min="0"
            max="2"
            step="0.01"
            value={localTemperature}
          />
          <div
            className="absolute text-sm"
            style={{
              left: `${(localTemperature || 0) * 50}%`,
              transform: `translateX(-${Math.min(
                Math.max((localTemperature || 0) * 50, 10),
                90
              )}%)`,
              top: "-1.5rem",
            }}
          >
            {localTemperature}
          </div>
        </div>
      </div>
    );
  }
);
LlmTab.displayName = "LlmTab";
