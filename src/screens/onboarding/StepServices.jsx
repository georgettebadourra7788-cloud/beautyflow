import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import FloatingInput from "../../components/FloatingInput.jsx";
import MaterialIcon from "../../components/icons/MaterialIcon.jsx";
import OnboardingLayout from "./OnboardingLayout.jsx";
import { useSalon } from "../../lib/SalonContext.jsx";
import { addServices } from "../../lib/api/salons.js";

export default function StepServices() {
  const navigate = useNavigate();
  const { salon, loading } = useSalon();
  const [services, setServices] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && !salon) {
    return <Navigate to="/onboarding/salon-info" replace />;
  }

  const handleAddService = () => {
    if (!name.trim()) return;
    setServices((prev) => [...prev, { name: name.trim(), price: price ? Number(price) : null }]);
    setName("");
    setPrice("");
  };

  const handleRemove = (index) => {
    setServices((prev) => prev.filter((_, i) => i !== index));
  };

  const handleContinue = async () => {
    setError("");
    setSubmitting(true);
    const { error: insertError } = await addServices(salon.id, services);
    setSubmitting(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    navigate("/onboarding/business-info");
  };

  return (
    <OnboardingLayout
      step={2}
      totalSteps={3}
      onContinue={handleContinue}
      continueDisabled={submitting}
      continueLabel={submitting ? "SAVING…" : "CONTINUE"}
      error={error}
    >
      <section className="bg-surface-container-lowest rounded-[24px] p-6 soft-shadow border border-outline-variant/30">
        <div className="flex items-center justify-between mb-stack-md">
          <h2 className="font-headline-md text-headline-md text-primary">Services</h2>
          <MaterialIcon name="spa" filled className="text-primary-container" />
        </div>

        {services.length === 0 ? (
          <p className="font-body-md text-body-md text-on-surface-variant mb-stack-md">
            Add the services your salon offers, so BeautyFlow can estimate the value of each lead.
          </p>
        ) : (
          <div className="space-y-stack-sm mb-stack-md">
            {services.map((service, index) => (
              <div
                key={`${service.name}-${index}`}
                className="flex items-center justify-between py-3 border-b border-outline-variant/30 last:border-b-0"
              >
                <span className="font-body-lg text-body-lg text-on-surface font-semibold">{service.name}</span>
                <div className="flex items-center gap-3">
                  <span className="font-label-lg text-label-lg text-on-surface-variant">
                    {service.price ? `$${service.price}` : "—"}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${service.name}`}
                    onClick={() => handleRemove(index)}
                    className="text-on-surface-variant hover:text-error transition-colors"
                  >
                    <MaterialIcon name="close" className="text-[18px]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <FloatingInput id="serviceName" label="Service name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="w-24">
            <FloatingInput id="servicePrice" label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddService}
          className="w-full mt-stack-md py-3 rounded-xl border border-dashed border-outline-variant text-on-surface-variant font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-surface-container transition-colors"
        >
          <MaterialIcon name="add" className="text-[18px]" />
          Add Service
        </button>
      </section>

      <section className="opacity-50 pointer-events-none space-y-stack-md">
        <div className="bg-surface-container-lowest rounded-[24px] p-6 soft-shadow flex justify-between items-center">
          <h2 className="font-headline-md text-headline-md text-on-surface-variant">Business Information</h2>
          <MaterialIcon name="storefront" className="text-outline-variant" />
        </div>
      </section>
    </OnboardingLayout>
  );
}
