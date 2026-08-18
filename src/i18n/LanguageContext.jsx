import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import en from "./translations/en.js";
import ar from "./translations/ar.js";

const TRANSLATIONS = { en, ar };
const STORAGE_KEY = "beautyflow_language";
const CHOSEN_STORAGE_KEY = "beautyflow_language_chosen";
const LanguageContext = createContext(null);

function getInitialLanguage() {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "ar" ? "ar" : "en";
}

function getInitialHasChosen() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(CHOSEN_STORAGE_KEY) === "1";
}

function resolve(dict, key) {
  return key.split(".").reduce((obj, part) => (obj && obj[part] !== undefined ? obj[part] : undefined), dict);
}

function interpolate(str, vars) {
  if (!vars) return str;
  return Object.entries(vars).reduce((acc, [k, v]) => acc.replaceAll(`{{${k}}}`, v), str);
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);
  const [hasChosenLanguage, setHasChosenLanguage] = useState(getInitialHasChosen);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  // Any explicit selection - from the first-run language screen or later
  // from More/Settings - both sets the active language and remembers that
  // a choice was made, so the first-run screen never shows again.
  const setLanguage = useCallback((lang) => {
    setLanguageState(lang === "ar" ? "ar" : "en");
    setHasChosenLanguage(true);
    window.localStorage.setItem(CHOSEN_STORAGE_KEY, "1");
  }, []);

  const t = useCallback(
    (key, vars) => {
      const dict = TRANSLATIONS[language] ?? TRANSLATIONS.en;
      const str = resolve(dict, key) ?? resolve(TRANSLATIONS.en, key) ?? key;
      return interpolate(str, vars);
    },
    [language]
  );

  const value = useMemo(
    () => ({ language, setLanguage, t, isRtl: language === "ar", hasChosenLanguage }),
    [language, setLanguage, t, hasChosenLanguage]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
