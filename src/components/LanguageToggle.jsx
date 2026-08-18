import { useLanguage } from "../i18n/LanguageContext.jsx";

// Compact, persistent language switcher shown in every main-app header.
// Tapping it flips the language in place - no navigation, no data reload,
// just the language/direction changing under the same screen and state.
export default function LanguageToggle({ className = "" }) {
  const { language, setLanguage, t } = useLanguage();
  const nextLang = language === "en" ? "ar" : "en";

  return (
    <button
      type="button"
      onClick={() => setLanguage(nextLang)}
      aria-label={t(nextLang === "ar" ? "languageToggle.switchToArabic" : "languageToggle.switchToEnglish")}
      className={`w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:opacity-80 transition-opacity text-primary font-label-lg text-label-lg flex-shrink-0 ${className}`}
    >
      {nextLang === "ar" ? "AR" : "EN"}
    </button>
  );
}
