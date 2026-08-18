import { NavLink } from "react-router-dom";
import MaterialIcon from "../icons/MaterialIcon.jsx";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

export default function BottomNav() {
  const { t } = useLanguage();
  const ITEMS = [
    { to: "/dashboard", label: t("nav.dashboard"), icon: "dashboard" },
    { to: "/leads", label: t("nav.leads"), icon: "person_search" },
    { to: "/conversations", label: t("nav.conversations"), icon: "chat_bubble" },
    { to: "/opportunities", label: t("nav.opportunities"), icon: "auto_graph" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-between items-center px-1 py-2 pb-safe bg-surface-container-lowest shadow-[0px_-10px_30px_rgba(45,45,45,0.05)] rounded-t-xl border-t border-surface-variant/50">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center px-1.5 py-1 rounded-full transition-all duration-150 ${
              isActive
                ? "bg-primary-container text-on-primary-container scale-90"
                : "text-on-secondary-container hover:bg-surface-variant/50"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <MaterialIcon name={item.icon} filled={isActive} className="mb-1" />
              <span className="font-label-sm text-label-sm whitespace-nowrap">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
      <NavLink
        to="/more"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center px-1.5 py-1 rounded-full transition-all duration-150 ${
            isActive
              ? "bg-primary-container text-on-primary-container scale-90"
              : "text-on-secondary-container hover:bg-surface-variant/50"
          }`
        }
      >
        <MaterialIcon name="more_horiz" className="mb-1" />
        <span className="font-label-sm text-label-sm">{t("nav.more")}</span>
      </NavLink>
    </nav>
  );
}
