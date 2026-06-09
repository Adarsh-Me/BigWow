import { create } from "zustand";

export type Locale = "en" | "ar";
export type Dir = "ltr" | "rtl";

interface LanguageState {
  locale: Locale;
  dir: Dir;
  setLocale: (locale: Locale) => void;
}

export const useLanguageStore = create<LanguageState>(() => ({
  locale: "en",
  dir: "ltr",
  setLocale: () => {},
}));
