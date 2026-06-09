"use client";

import { NextIntlClientProvider } from "next-intl";
import type { Locale } from "@/store/language-store";
import { Toaster } from "sonner";
import enMessages from "../../messages/en.json";

const messages = { en: enMessages } as const;

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLocale: Locale;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  return (
    <NextIntlClientProvider locale="en" messages={messages.en} timeZone="UTC">
      {children}
      <Toaster richColors position="top-right" />
    </NextIntlClientProvider>
  );
}
