import { useNavigate } from "react-router-dom";
import MaterialIcon from "../../components/icons/MaterialIcon.jsx";
import { useSalon } from "../../lib/SalonContext.jsx";

export default function OnboardingComplete() {
  const navigate = useNavigate();
  const { salon } = useSalon();

  return (
    <main className="flex-grow flex flex-col max-w-md md:max-w-lg w-full mx-auto relative overflow-hidden min-h-screen bg-surface-bright">
      <div className="absolute inset-0 pointer-events-none z-0 flex items-start justify-center overflow-hidden">
        <div className="w-[300px] h-[300px] bg-primary-container opacity-30 rounded-full blur-3xl transform -translate-y-1/3" />
      </div>
      <div className="flex-grow flex flex-col justify-center px-container-padding relative z-10 pt-16">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 mb-stack-lg bg-surface-container-lowest rounded-full shadow-[0px_10px_30px_rgba(45,45,45,0.05)] flex items-center justify-center border border-surface-dim/20 relative">
            <MaterialIcon name="check_circle" filled className="text-5xl text-primary" />
          </div>
          <h1 className="font-display text-[34px] leading-tight text-on-surface mb-stack-md">
            Your BeautyFlow workspace is ready.
          </h1>
          <p className="font-body-lg text-[15px] text-on-surface-variant max-w-[300px] mx-auto opacity-90">
            We've tailored the experience to {salon?.name ?? "your salon"}. You're all set to start recovering
            missed bookings.
          </p>
        </div>
      </div>
      <div className="px-container-padding pb-8 pt-stack-lg relative z-10 bg-gradient-to-t from-surface-bright via-surface-bright to-transparent">
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full bg-primary-container text-on-primary-container font-label-lg text-[11px] uppercase py-4 px-6 rounded-xl shadow-[0px_4px_10px_rgba(45,45,45,0.03)] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span>Go to Dashboard</span>
          <MaterialIcon name="arrow_forward" className="text-[18px]" />
        </button>
      </div>
    </main>
  );
}
