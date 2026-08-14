import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import FloatingInput from "../../components/FloatingInput.jsx";
import MaterialIcon from "../../components/icons/MaterialIcon.jsx";
import OnboardingLayout from "./OnboardingLayout.jsx";
import { useSalon } from "../../lib/SalonContext.jsx";
import { updateSalon } from "../../lib/api/salons.js";

export default function StepBusinessInfo() {
  const navigate = useNavigate();
  const { salon, loading, setSalon } = useSalon();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState(salon?.phone ?? "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && !salon) {
    return <Navigate to="/onboarding/salon-info" replace />;
  }

  const handleContinue = async () => {
    setError("");
    setSubmitting(true);
    const { data, error: updateError } = await updateSalon(salon.id, {
      address: address.trim() || null,
      phone: phone.trim() || salon.phone || null,
    });
    setSubmitting(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setSalon(data);
    navigate("/onboarding/complete");
  };

  return (
    <OnboardingLayout
      step={3}
      totalSteps={3}
      onContinue={handleContinue}
      continueDisabled={submitting}
      continueLabel={submitting ? "SAVING…" : "FINISH SETUP"}
      continueIcon="check"
      error={error}
    >
      <section className="bg-surface-container-lowest rounded-[24px] p-6 soft-shadow border border-outline-variant/30">
        <div className="flex items-center justify-between mb-stack-md">
          <h2 className="font-headline-md text-headline-md text-primary">Business Information</h2>
          <MaterialIcon name="storefront" filled className="text-primary-container" />
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant mb-stack-md">
          Where can customers find {salon?.name ?? "your salon"}?
        </p>
        <div className="space-y-stack-md">
          <FloatingInput id="address" label="Salon Address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <FloatingInput
            id="businessPhone"
            label="Business Phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </section>
    </OnboardingLayout>
  );
}
