import { NavLink } from "react-router-dom";
import MaterialIcon from "../icons/MaterialIcon.jsx";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

export default function SideNav() {
  const { t } = useLanguage();
  const ITEMS = [
    { to: "/dashboard", icon: "dashboard", label: t("nav.dashboard") },
    { to: "/leads", icon: "person_search", label: t("nav.leads") },
    { to: "/conversations", icon: "chat_bubble", label: t("nav.conversations") },
    { to: "/opportunities", icon: "auto_graph", label: t("nav.opportunities") },
  ];

  return (
    <div className="hidden md:flex fixed start-0 top-0 h-full w-20 bg-surface border-e border-surface-container-high flex-col items-center py-6 gap-8 z-50">
      <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-headline-md">
        B
      </div>
      <div className="flex flex-col gap-6 mt-8">
        {ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={item.label}
            className={({ isActive }) =>
              `p-3 rounded-xl transition-colors ${
                isActive
                  ? "bg-primary-container text-on-primary-container shadow-sm"
                  : "text-secondary hover:bg-surface-container"
              }`
            }
          >
            {({ isActive }) => <MaterialIcon name={item.icon} filled={isActive} />}
          </NavLink>
        ))}
      </div>
      <NavLink
        to="/more"
        title={t("nav.more")}
        className={({ isActive }) =>
          `p-3 rounded-xl transition-colors mt-auto ${
            isActive
              ? "bg-primary-container text-on-primary-container shadow-sm"
              : "text-secondary hover:bg-surface-container"
          }`
        }
      >
        {({ isActive }) => <MaterialIcon name="more_horiz" filled={isActive} />}
      </NavLink>
    </div>
  );
}
