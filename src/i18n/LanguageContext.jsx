import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import en from "./translations/en.js";
import ar from "./translations/ar.js";

const TRANSLATIONS = { en, ar };
const STORAGE_KEY = "beautyflow_language";
const LanguageContext = createContext(null);

function getInitialLanguage() {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "ar" ? "ar" : "en";
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

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang === "ar" ? "ar" : "en");
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
    () => ({ language, setLanguage, t, isRtl: language === "ar" }),
    [language, setLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
