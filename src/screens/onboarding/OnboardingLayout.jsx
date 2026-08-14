import MaterialIcon from "../../components/icons/MaterialIcon.jsx";

const TOTAL_STEPS = 5;

export default function OnboardingLayout({
  step,
  title = "Set Up Your Salon",
  subtitle = "Let's personalize BeautyFlow for your business.",
  continueLabel = "CONTINUE",
  continueIcon = "arrow_forward",
  onContinue,
  children,
}) {
  return (
    <div className="w-full max-w-md md:max-w-lg mx-auto min-h-screen flex flex-col bg-surface relative shadow-2xl md:shadow-none">
      <header className="pt-12 px-container-padding pb-stack-lg flex-shrink-0">
        <h1 className="font-display text-display text-primary mb-stack-sm tracking-tight leading-tight">{title}</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">{subtitle}</p>
      </header>

      <main className="flex-grow px-container-padding pb-40 overflow-y-auto hide-scrollbar space-y-stack-lg">
        {children}
      </main>

      <div className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-md pb-safe pt-4 px-container-padding border-t border-outline-variant/20 z-50">
        <div className="w-full max-w-md md:max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">
              Step {step} of {TOTAL_STEPS}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
                <div
                  key={s}
                  className={`h-1 rounded-full transition-all ${
                    s === step ? "w-8 bg-primary" : s < step ? "w-4 bg-primary/30" : "w-4 bg-surface-variant"
                  }`}
                />
              ))}
            </div>
          </div>
          <button
            onClick={onContinue}
            className="w-full bg-primary-container text-on-primary-container font-label-lg text-label-lg py-4 rounded-xl flex justify-center items-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all mb-4"
          >
            {continueLabel}
            <MaterialIcon name={continueIcon} className="text-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
