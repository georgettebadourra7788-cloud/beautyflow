import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MaterialIcon from "../../components/icons/MaterialIcon.jsx";
import OnboardingLayout from "./OnboardingLayout.jsx";

function FloatingInput({ id, label, type = "text", value, onChange }) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={label}
        className="block w-full px-0 py-3 border-0 border-b border-outline-variant bg-transparent focus:ring-0 focus:border-primary peer text-on-surface font-body-lg placeholder-transparent"
      />
      <label
        htmlFor={id}
        className="absolute left-0 -top-2.5 text-on-surface-variant font-label-lg text-label-lg transition-all peer-placeholder-shown:text-body-lg peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-label-lg peer-focus:text-primary"
      >
        {label}
      </label>
    </div>
  );
}

export default function StepSalonInfo() {
  const navigate = useNavigate();
  const [salonName, setSalonName] = useState("Glow Beauty Studio");
  const [ownerName, setOwnerName] = useState("Sarah");
  const [phone, setPhone] = useState("+1 555 123 4567");

  return (
    <OnboardingLayout step={1} onContinue={() => navigate("/onboarding/services")}>
      <section className="bg-surface-container-lowest rounded-[24px] p-6 soft-shadow border border-outline-variant/30">
        <div className="flex items-center justify-between mb-stack-md">
          <h2 className="font-headline-md text-headline-md text-primary">Salon Information</h2>
          <MaterialIcon name="check_circle" filled className="text-primary-container" />
        </div>
        <div className="space-y-stack-md">
          <FloatingInput id="salonName" label="Salon Name" value={salonName} onChange={(e) => setSalonName(e.target.value)} />
          <FloatingInput id="ownerName" label="Owner Name" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
          <FloatingInput
            id="phoneNumber"
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </section>

      <section className="opacity-50 pointer-events-none space-y-stack-md">
        <div className="bg-surface-container-lowest rounded-[24px] p-6 soft-shadow flex justify-between items-center">
          <h2 className="font-headline-md text-headline-md text-on-surface-variant">Services</h2>
          <MaterialIcon name="spa" className="text-outline-variant" />
        </div>
        <div className="bg-surface-container-lowest rounded-[24px] p-6 soft-shadow flex justify-between items-center">
          <h2 className="font-headline-md text-headline-md text-on-surface-variant">Opening Hours</h2>
          <MaterialIcon name="schedule" className="text-outline-variant" />
        </div>
      </section>
    </OnboardingLayout>
  );
}
