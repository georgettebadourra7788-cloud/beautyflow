import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MaterialIcon from "../../components/icons/MaterialIcon.jsx";
import OnboardingLayout from "./OnboardingLayout.jsx";

const DEFAULT_PREFS = [
  { key: "newLead", label: "New Lead Alerts", desc: "Get notified when a new inquiry comes in", on: true },
  { key: "followUp", label: "Follow-up Reminders", desc: "Reminders for leads waiting on a reply", on: true },
  { key: "weeklySummary", label: "Weekly Summary", desc: "A recap of recovered bookings each week", on: false },
];

export default function StepNotifications() {
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);

  const toggle = (key) => {
    setPrefs((prev) => prev.map((p) => (p.key === key ? { ...p, on: !p.on } : p)));
  };

  return (
    <OnboardingLayout step={4} onContinue={() => navigate("/onboarding/connect")}>
      <section className="bg-surface-container-lowest rounded-[24px] p-6 soft-shadow border border-outline-variant/30">
        <div className="flex items-center justify-between mb-stack-md">
          <h2 className="font-headline-md text-headline-md text-primary">Notifications</h2>
          <MaterialIcon name="notifications" filled className="text-primary-container" />
        </div>
        <div className="space-y-stack-md">
          {prefs.map((pref) => (
            <div key={pref.key} className="flex items-center justify-between py-3 border-b border-outline-variant/30 last:border-b-0">
              <div>
                <h3 className="font-body-lg text-body-lg text-on-surface font-semibold">{pref.label}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">{pref.desc}</p>
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
