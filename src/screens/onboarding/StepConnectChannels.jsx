import { useNavigate } from "react-router-dom";
import MaterialIcon from "../../components/icons/MaterialIcon.jsx";
import OnboardingLayout from "./OnboardingLayout.jsx";

export default function StepConnectChannels() {
  const navigate = useNavigate();

  return (
    <OnboardingLayout
      step={5}
      continueLabel="FINISH SETUP"
      continueIcon="check"
      onContinue={() => navigate("/onboarding/complete")}
    >
      <section className="bg-surface-container-lowest rounded-[24px] p-6 soft-shadow border border-outline-variant/30">
        <div className="flex items-center justify-between mb-stack-lg">
          <h2 className="font-headline-md text-headline-md text-primary">Connect Your Channels</h2>
          <MaterialIcon name="hub" filled className="text-primary-container" />
        </div>
        <div className="space-y-stack-md">
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                <MaterialIcon name="photo_camera" className="text-on-surface-variant" />
              </div>
              <div>
                <h3 className="font-body-lg text-body-lg text-on-surface font-semibold">Instagram</h3>
                <div className="flex items-center gap-1 mt-1">
                  <MaterialIcon name="check_circle" filled className="text-primary text-[14px]" />
                  <span className="font-body-md text-body-md text-primary">Connected</span>
                </div>
              </div>
            </div>
            <button className="font-label-lg text-label-lg text-primary hover:text-primary/80 transition-colors">
              Change Account
            </button>
          </div>

          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                <MaterialIcon name="chat" className="text-on-surface-variant" />
              </div>
              <div>
                <h3 className="font-body-lg text-body-lg text-on-surface font-semibold">WhatsApp</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">Not connected</p>
              </div>
            </div>
            <button className="font-label-lg text-label-lg text-on-primary-container bg-primary-container/50 px-4 py-2 rounded-full hover:bg-primary-container/70 transition-colors">
              Connect WhatsApp
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                <MaterialIcon name="language" className="text-on-surface-variant" />
              </div>
              <div>
                <h3 className="font-body-lg text-body-lg text-on-surface font-semibold">Website</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">Not connected</p>
              </div>
            </div>
            <button className="font-label-lg text-label-lg text-on-primary-container bg-primary-container/50 px-4 py-2 rounded-full hover:bg-primary-container/70 transition-colors">
              Add Website
            </button>
          </div>
        </div>
      </section>
    </OnboardingLayout>
  );
}
