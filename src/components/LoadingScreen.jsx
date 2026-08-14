export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-primary-container border-t-primary animate-spin" />
        <span className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">
          Loading BeautyFlow…
        </span>
      </div>
    </div>
  );
}
