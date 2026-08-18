import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingInput from "../components/FloatingInput.jsx";
import MaterialIcon from "../components/icons/MaterialIcon.jsx";
import { useSalon } from "../lib/SalonContext.jsx";
import { updateSalon } from "../lib/api/salons.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function EditSalon() {
  const { salon, setSalon } = useSalon();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [name, setName] = useState(salon?.name ?? "");
  const [phone, setPhone] = useState(salon?.phone ?? "");
  const [address, setAddress] = useState(salon?.address ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t("salonSettings.nameRequired"));
      return;
    }
    setSubmitting(true);
    setError("");
    const { data, error: updateError } = await updateSalon(salon.id, {
      name: name.trim(),
      phone: phone.trim() || null,
      address: address.trim() || null,
    });
    setSubmitting(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setSalon(data);
    setSaved(true);
  };

  return (
    <>
      <header className="px-container-padding pt-stack-lg pb-stack-md flex items-center gap-3 bg-surface sticky top-0 z-30">
        <button
          onClick={() => navigate("/more")}
          aria-label={t("salonSettings.backAria")}
          className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors"
        >
          <MaterialIcon name="arrow_back" />
        </button>
        <h1 className="font-headline-lg text-headline-lg text-on-surface">{t("salonSettings.title")}</h1>
      </header>

      <main className="px-container-padding pb-40 flex flex-col gap-stack-lg">
        <form
          onSubmit={handleSubmit}
          className="bg-surface-container-lowest rounded-[24px] p-6 soft-shadow border border-outline-variant/30 space-y-stack-md"
        >
          <div className="flex items-center justify-between mb-stack-md">
            <h2 className="font-headline-md text-headline-md text-primary">{t("salonSettings.heading")}</h2>
            <MaterialIcon name="storefront" filled className="text-primary-container" />
          </div>
          <FloatingInput
            id="salonName"
            label={t("salonSettings.nameLabel")}
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSaved(false);
            }}
          />
          <FloatingInput
            id="phone"
            label={t("salonSettings.phoneLabel")}
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setSaved(false);
            }}
          />
          <FloatingInput
            id="address"
            label={t("salonSettings.addressLabel")}
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setSaved(false);
            }}
          />
          {error && <p className="font-body-md text-body-md text-error">{error}</p>}
          {saved && !error && <p className="font-body-md text-body-md text-primary">{t("salonSettings.saved")}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary-container text-on-primary-container font-label-lg text-label-lg py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? t("salonSettings.saving") : t("salonSettings.saveChanges")}
          </button>
        </form>
      </main>
    </>
  );
}
