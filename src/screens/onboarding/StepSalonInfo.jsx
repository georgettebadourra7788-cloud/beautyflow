import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingInput from "../../components/FloatingInput.jsx";
import MaterialIcon from "../../components/icons/MaterialIcon.jsx";
import OnboardingLayout from "./OnboardingLayout.jsx";
import { useAuth } from "../../lib/AuthContext.jsx";
import { useSalon } from "../../lib/SalonContext.jsx";
import { supabase } from "../../lib/supabaseClient.js";
import { createSalon } from "../../lib/api/salons.js";

export default function StepSalonInfo() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const { setSalon } = useSalon();
  const [salonName, setSalonName] = useState("");
  const [ownerName, setOwnerName] = useState(profile?.full_name ?? "");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleContinue = async () => {
    setError("");
    if (!salonName.trim()) {
      setError("Salon name is required.");
      return;
    }
    setSubmitting(true);

    if (ownerName.trim() && ownerName !== profile?.full_name) {
      await supabase.from("profiles").update({ full_name: ownerName.trim() }).eq("id", user.id);
      refreshProfile();
    }

    const { data, error: createError } = await createSalon({
      ownerId: user.id,
      name: salonName.trim(),
      phone: phone.trim() || null,
    });

    setSubmitting(false);
    if (createError) {
      setError(createError.message);
      return;
    }
    setSalon(data);
    navigate("/onboarding/services");
  };

  return (
    <OnboardingLayout
      step={1}
      totalSteps={3}
      onContinue={handleContinue}
      continueDisabled={submitting}
      continueLabel={submitting ? "SAVING…" : "CONTINUE"}
      error={error}
    >
      <section className="bg-surface-container-lowest rounded-[24px] p-6 soft-shadow border border-outline-variant/30">
        <div className="flex items-center justify-between mb-stack-md">
          <h2 className="font-headline-md text-headline-md text-primary">Salon Information</h2>
          <MaterialIcon name="check_circle" filled className="text-primary-container" />
        </div>
        <div className="space-y-stack-md">
          <FloatingInput id="salonName" label="Salon Name" required value={salonName} onChange={(e) => setSalonName(e.target.value)} />
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
          <h2 className="font-headline-md text-headline-md text-on-surface-variant">Business Information</h2>
          <MaterialIcon name="storefront" className="text-outline-variant" />
        </div>
      </section>
    </OnboardingLayout>
  );
}
