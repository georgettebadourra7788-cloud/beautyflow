import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MaterialIcon from "../../components/icons/MaterialIcon.jsx";
import OnboardingLayout from "./OnboardingLayout.jsx";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

const DEFAULT_HOURS = [
  { day: "Monday", open: true, hours: "9:00 AM – 6:00 PM" },
  { day: "Tuesday", open: true, hours: "9:00 AM – 6:00 PM" },
  { day: "Wednesday", open: true, hours: "9:00 AM – 6:00 PM" },
  { day: "Thursday", open: true, hours: "9:00 AM – 8:00 PM" },
  { day: "Friday", open: true, hours: "9:00 AM – 8:00 PM" },
  { day: "Saturday", open: true, hours: "10:00 AM – 4:00 PM" },
  { day: "Sunday", open: false, hours: "Closed" },
];

export default function StepHours() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [hours, setHours] = useState(DEFAULT_HOURS);

  const toggleDay = (day) => {
    setHours((prev) => prev.map((d) => (d.day === day ? { ...d, open: !d.open } : d)));
  };

  return (
    <OnboardingLayout step={3} onContinue={() => navigate("/onboarding/notifications")}>
      <section className="bg-surface-container-lowest rounded-[24px] p-6 soft-shadow border border-outline-variant/30">
        <div className="flex items-center justify-between mb-stack-md">
          <h2 className="font-headline-md text-headline-md text-primary">{t("onboarding.hours.heading")}</h2>
          <MaterialIcon name="schedule" filled className="text-primary-container" />
        </div>
        <div className="space-y-stack-sm">
          {hours.map((d) => (
            <div key={d.day} className="flex items-center justify-between py-3 border-b border-outline-variant/30 last:border-b-0">
              <span className="font-body-lg text-body-lg text-on-surface font-semibold">
                {t(`onboarding.hours.days.${d.day}`)}
              </span>
              <div className="flex items-center gap-3">
                <span className={`font-label-lg text-label-lg ${d.open ? "text-on-surface-variant" : "text-outline"}`}>
                  {d.open ? d.hours : t("onboarding.hours.closed")}
                </span>
                <button
                  onClick={() => toggleDay(d.day)}
                  className={`w-10 h-6 rounded-full flex items-center px-0.5 transition-colors ${
                    d.open ? "bg-primary-container justify-end" : "bg-surface-variant justify-start"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-surface-container-lowest shadow" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </OnboardingLayout>
  );
}
