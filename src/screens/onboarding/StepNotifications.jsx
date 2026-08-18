import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MaterialIcon from "../../components/icons/MaterialIcon.jsx";
import OnboardingLayout from "./OnboardingLayout.jsx";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

const PREF_KEYS = ["newLead", "followUp", "weeklySummary"];
const DEFAULT_ON = { newLead: true, followUp: true, weeklySummary: false };

export default function StepNotifications() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [prefs, setPrefs] = useState(PREF_KEYS.map((key) => ({ key, on: DEFAULT_ON[key] })));

  const toggle = (key) => {
    setPrefs((prev) => prev.map((p) => (p.key === key ? { ...p, on: !p.on } : p)));
  };

  return (
    <OnboardingLayout step={4} onContinue={() => navigate("/onboarding/connect")}>
      <section className="bg-surface-container-lowest rounded-[24px] p-6 soft-shadow border border-outline-variant/30">
        <div className="flex items-center justify-between mb-stack-md">
          <h2 className="font-headline-md text-headline-md text-primary">{t("onboarding.notifications.heading")}</h2>
          <MaterialIcon name="notifications" filled className="text-primary-container" />
        </div>
        <div className="space-y-stack-md">
          {prefs.map((pref) => (
            <div key={pref.key} className="flex items-center justify-between py-3 border-b border-outline-variant/30 last:border-b-0">
              <div>
                <h3 className="font-body-lg text-body-lg text-on-surface font-semibold">
                  {t(`onboarding.notifications.${pref.key}.label`)}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  {t(`onboarding.notifications.${pref.key}.desc`)}
                </p>
              </div>
              <button
                onClick={() => toggle(pref.key)}
                className={`w-10 h-6 rounded-full flex items-center px-0.5 flex-shrink-0 transition-colors ${
                  pref.on ? "bg-primary-container justify-end" : "bg-surface-variant justify-start"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-surface-container-lowest shadow" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </OnboardingLayout>
  );
}
