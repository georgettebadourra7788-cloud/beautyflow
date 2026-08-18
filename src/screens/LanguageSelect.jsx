import { useNavigate } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function LanguageSelect() {
  const { t, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const choose = (lang) => {
    setLanguage(lang);
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center px-container-padding">
      <div className="w-full max-w-sm mx-auto">
        <div className="mb-stack-lg text-center">
          <div className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-primary-container text-on-primary-container mb-stack-md font-headline-md text-headline-md tracking-tight">
            BeautyFlow
          </div>
          <h1 className="font-display text-[34px] leading-tight text-primary mb-stack-sm">
            {t("languageSelect.heading")}
          </h1>
        </div>

        <div className="bg-surface-container-lowest rounded-[24px] p-6 soft-shadow border border-outline-variant/30 space-y-stack-md">
          <button
            type="button"
            onClick={() => choose("en")}
            className="w-full bg-primary-container text-on-primary-container font-label-lg text-label-lg py-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all"
          >
            English
          </button>
          <button
            type="button"
            onClick={() => choose("ar")}
            className="w-full bg-surface-container border border-surface-variant text-on-surface font-label-lg text-label-lg py-4 rounded-xl hover:bg-surface-variant transition-colors active:scale-[0.98]"
          >
            العربية
          </button>
        </div>
      </div>
    </div>
  );
}
