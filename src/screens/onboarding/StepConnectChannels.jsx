import { useNavigate } from "react-router-dom";
import MaterialIcon from "../../components/icons/MaterialIcon.jsx";
import OnboardingLayout from "./OnboardingLayout.jsx";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

export default function StepConnectChannels() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <OnboardingLayout
      step={5}
      continueLabel={t("onboarding.connect.finish")}
      continueIcon="check"
      onContinue={() => navigate("/onboarding/complete")}
    >
      <section className="bg-surface-container-lowest rounded-[24px] p-6 soft-shadow border border-outline-variant/30">
        <div className="flex items-center justify-between mb-stack-lg">
          <h2 className="font-headline-md text-headline-md text-primary">{t("onboarding.connect.heading")}</h2>
          <MaterialIcon name="hub" filled className="text-primary-container" />
        </div>
        <div className="space-y-stack-md">
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                <MaterialIcon name="photo_camera" className="text-on-surface-variant" />
              </div>
              <div>
                <h3 className="font-body-lg text-body-lg text-on-surface font-semibold">{t("onboarding.connect.instagram")}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <MaterialIcon name="check_circle" filled className="text-primary text-[14px]" />
                  <span className="font-body-md text-body-md text-primary">{t("onboarding.connect.connected")}</span>
                </div>
              </div>
            </div>
            <button className="font-label-lg text-label-lg text-primary hover:text-primary/80 transition-colors">
              {t("onboarding.connect.changeAccount")}
            </button>
          </div>

          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                <MaterialIcon name="chat" className="text-on-surface-variant" />
              </div>
              <div>
                <h3 className="font-body-lg text-body-lg text-on-surface font-semibold">{t("onboarding.connect.whatsapp")}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">{t("onboarding.connect.notConnected")}</p>
              </div>
            </div>
            <button className="font-label-lg text-label-lg text-on-primary-container bg-primary-container/50 px-4 py-2 rounded-full hover:bg-primary-container/70 transition-colors">
              {t("onboarding.connect.connectWhatsapp")}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                <MaterialIcon name="language" className="text-on-surface-variant" />
              </div>
              <div>
                <h3 className="font-body-lg text-body-lg text-on-surface font-semibold">{t("onboarding.connect.website")}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">{t("onboarding.connect.notConnected")}</p>
              </div>
            </div>
            <button className="font-label-lg text-label-lg text-on-primary-container bg-primary-container/50 px-4 py-2 rounded-full hover:bg-primary-container/70 transition-colors">
              {t("onboarding.connect.addWebsite")}
            </button>
          </div>
        </div>
      </section>
    </OnboardingLayout>
  );
}
