import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MaterialIcon from "../../components/icons/MaterialIcon.jsx";
import OnboardingLayout from "./OnboardingLayout.jsx";

const DEFAULT_SERVICES = [
  { name: "Balayage", price: "$150" },
  { name: "Hair Color", price: "$80" },
  { name: "Facial", price: "$120" },
];

export default function StepServices() {
  const navigate = useNavigate();
  const [services] = useState(DEFAULT_SERVICES);

  return (
    <OnboardingLayout step={2} onContinue={() => navigate("/onboarding/hours")}>
      <section className="bg-surface-container-lowest rounded-[24px] p-6 soft-shadow border border-outline-variant/30">
        <div className="flex items-center justify-between mb-stack-md">
          <h2 className="font-headline-md text-headline-md text-primary">Services</h2>
          <MaterialIcon name="spa" filled className="text-primary-container" />
        </div>
        <div className="space-y-stack-sm">
          {services.map((service) => (
            <div
              key={service.name}
              className="flex items-center justify-between py-3 border-b border-outline-variant/30 last:border-b-0"
            >
              <span className="font-body-lg text-body-lg text-on-surface font-semibold">{service.name}</span>
              <span className="font-label-lg text-label-lg text-on-surface-variant">{service.price}</span>
            </div>
          ))}
        </div>
        <button className="w-full mt-stack-md py-3 rounded-xl border border-dashed border-outline-variant text-on-surface-variant font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-surface-container transition-colors">
          <MaterialIcon name="add" className="text-[18px]" />
          Add Service
        </button>
      </section>

      <section className="opacity-50 pointer-events-none space-y-stack-md">
        <div className="bg-surface-container-lowest rounded-[24px] p-6 soft-shadow flex justify-between items-center">
          <h2 className="font-headline-md text-headline-md text-on-surface-variant">Opening Hours</h2>
          <MaterialIcon name="schedule" className="text-outline-variant" />
        </div>
      </section>
    </OnboardingLayout>
  );
}
