"use client";

import { useState } from "react";
import { FeedbackType } from "../types";
import { FiThumbsDown, FiThumbsUp } from "react-icons/fi";
import { ModalWrapper } from "./ModalWrapper";
import {
  DislikeFeedbackIcon,
  LikeFeedbackIcon,
} from "@/components/icons/icons";
import { useTranslations } from "next-intl";

const predefinedPositiveFeedbackOptions =
  process.env.NEXT_PUBLIC_POSITIVE_PREDEFINED_FEEDBACK_OPTIONS?.split(",") ||
  [];
const predefinedNegativeFeedbackOptions =
  process.env.NEXT_PUBLIC_NEGATIVE_PREDEFINED_FEEDBACK_OPTIONS?.split(",") || [
    "Retrieved documents were not relevant",
    "AI misread the documents",
    "Cited source had incorrect information",
  ];

interface FeedbackModalProps {
  feedbackType: FeedbackType;
  onClose: () => void;
  onSubmit: (feedbackDetails: {
    message: string;
    predefinedFeedback?: string;
  }) => void;
}

export const FeedbackModal = ({
  feedbackType,
  onClose,
  onSubmit,
}: FeedbackModalProps) => {
  const [message, setMessage] = useState("");
  const [predefinedFeedback, setPredefinedFeedback] = useState<
    string | undefined
  >();

  const handlePredefinedFeedback = (feedback: string) => {
    setPredefinedFeedback(feedback);
  };

  const handleSubmit = () => {
    onSubmit({ message, predefinedFeedback });
    onClose();
  };

  const predefinedFeedbackOptions =
    feedbackType === "like"
      ? predefinedPositiveFeedbackOptions
      : predefinedNegativeFeedbackOptions;
  const trans = useTranslations("chat");
  return (
    <ModalWrapper onClose={onClose} modalClassName="max-w-5xl">
      <>
        <h2 className="text-2xl text-emphasis font-bold mb-4 flex">
          <div className="mr-1 my-auto">
            {feedbackType === "like" ? (
              <LikeFeedbackIcon
                size={20}
                className="text-green-500 my-auto mr-2"
              />
            ) : (
              <DislikeFeedbackIcon
                size={20}
                className="text-red-600 my-auto mr-2"
              />
            )}
          </div>
          {trans("feedback-additional")}
        </h2>

        <div className="mb-4 flex flex-wrap justify-start">
          {predefinedFeedbackOptions.map((feedback, index) => (
            <button
              key={index}
              className={`bg-border hover:bg-hover text-default py-2 px-4 rounded m-1 
                ${predefinedFeedback === feedback && "ring-2 ring-accent"}`}
              onClick={() => handlePredefinedFeedback(feedback)}
            >
              {feedback}
            </button>
          ))}
        </div>

        <textarea
          autoFocus
          className={`
            w-full flex-grow 
            border border-border-strong rounded 
            outline-none placeholder-subtle 
            pl-4 pr-4 py-4 bg-background 
            overflow-hidden h-28 
            whitespace-normal resize-none 
            break-all overscroll-contain
          `}
          role="textarea"
          aria-multiline
          placeholder={
            feedbackType === "like"
              ? trans("feedback-like")
              : trans("feedback-dislike")
          }
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="flex mt-2">
          <button
            className="bg-accent text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none mx-auto"
            onClick={handleSubmit}
          >
            {trans("feedback-submit")}
          </button>
        </div>
      </>
    </ModalWrapper>
  );
};
