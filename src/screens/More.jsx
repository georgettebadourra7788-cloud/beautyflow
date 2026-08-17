import { Link, useNavigate } from "react-router-dom";
import MaterialIcon from "../components/icons/MaterialIcon.jsx";
import { useAuth } from "../lib/AuthContext.jsx";

const ITEMS = [
  { icon: "store", label: "Salon Settings", to: "/salon-settings", enabled: true },
  { icon: "settings", label: "Settings", enabled: false },
  { icon: "credit_card", label: "Billing", enabled: false },
];

export default function More() {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <header className="px-container-padding pt-stack-lg pb-stack-md bg-surface sticky top-0 z-30">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">More</h1>
        {profile?.full_name && (
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Signed in as {profile.full_name}</p>
        )}
      </header>
      <main className="px-container-padding pb-40 flex flex-col gap-stack-md">
        {ITEMS.map((item) =>
          item.enabled ? (
            <Link
              key={item.label}
              to={item.to}
              className="bg-surface-container-lowest rounded-2xl p-5 soft-shadow border border-surface-variant/50 flex items-center justify-between hover:bg-surface-container transition-colors"
            >
              <div className="flex items-center gap-4">
                <MaterialIcon name={item.icon} className="text-primary" />
                <span className="font-body-lg text-body-lg text-on-surface font-semibold">{item.label}</span>
              </div>
              <MaterialIcon name="chevron_right" className="text-on-surface-variant" />
            </Link>
          ) : (
            <div
              key={item.label}
              className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-variant/50 flex items-center justify-between opacity-50"
            >
              <div className="flex items-center gap-4">
                <MaterialIcon name={item.icon} className="text-on-surface-variant" />
                <span className="font-body-lg text-body-lg text-on-surface font-semibold">{item.label}</span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Coming soon</span>
            </div>
          )
        )}

        <button
          onClick={handleLogOut}
          className="bg-surface-container-lowest rounded-2xl p-5 soft-shadow border border-surface-variant/50 flex items-center gap-4 hover:bg-surface-container transition-colors text-left"
        >
          <MaterialIcon name="logout" className="text-error" />
          <span className="font-body-lg text-body-lg text-error font-semibold">Log Out</span>
        </button>
      </main>
    </>
  );
}
