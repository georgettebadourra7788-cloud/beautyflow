import { Link, useNavigate } from "react-router-dom";
import MaterialIcon from "../components/icons/MaterialIcon.jsx";
import { useAuth } from "../lib/AuthContext.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function More() {
  const { signOut, profile } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const ITEMS = [
    { icon: "store", label: t("more.salonSettings"), to: "/salon-settings", enabled: true },
    { icon: "settings", label: t("more.settings"), enabled: false },
    { icon: "credit_card", label: t("more.billing"), enabled: false },
  ];

  const handleLogOut = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <header className="px-container-padding pt-stack-lg pb-stack-md bg-surface sticky top-0 z-30">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">{t("more.title")}</h1>
        {profile?.full_name && (
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            {t("more.signedInAs", { name: profile.full_name })}
          </p>
        )}
      </header>
      <main className="px-container-padding pb-40 flex flex-col gap-stack-md">
        <div className="bg-surface-container-lowest rounded-2xl p-5 soft-shadow border border-surface-variant/50">
          <div className="flex items-center gap-4 mb-4">
            <MaterialIcon name="language" className="text-primary" />
            <span className="font-body-lg text-body-lg text-on-surface font-semibold">{t("more.language")}</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              aria-pressed={language === "en"}
              className={`flex-1 py-2.5 rounded-xl font-label-lg text-label-lg transition-colors ${
                language === "en"
                  ? "bg-primary-container text-on-primary-container"
                  : "bg-surface-container border border-surface-variant text-on-surface-variant hover:bg-surface-variant"
              }`}
            >
              {t("more.english")}
            </button>
            <button
              type="button"
              onClick={() => setLanguage("ar")}
              aria-pressed={language === "ar"}
              className={`flex-1 py-2.5 rounded-xl font-label-lg text-label-lg transition-colors ${
                language === "ar"
                  ? "bg-primary-container text-on-primary-container"
                  : "bg-surface-container border border-surface-variant text-on-surface-variant hover:bg-surface-variant"
              }`}
            >
              {t("more.arabic")}
            </button>
          </div>
        </div>

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
              <span className="font-label-sm text-label-sm text-on-surface-variant">{t("more.comingSoon")}</span>
            </div>
          )
        )}

        <button
          onClick={handleLogOut}
          className="bg-surface-container-lowest rounded-2xl p-5 soft-shadow border border-surface-variant/50 flex items-center gap-4 hover:bg-surface-container transition-colors text-start"
        >
          <MaterialIcon name="logout" className="text-error" />
          <span className="font-body-lg text-body-lg text-error font-semibold">{t("more.logOut")}</span>
        </button>
      </main>
    </>
  );
}
