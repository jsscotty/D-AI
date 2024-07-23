"use client";
import React, { useEffect } from "react";
import Script from "next/script";

export function TranslateWidget() {
  useEffect(() => {
    const googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: "en",
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };
    (window as any).googleTranslateElementInit = googleTranslateElementInit;
  }, []);

  return (
    <>
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      <div id="google_translate_element"></div>
    </>
  );
}