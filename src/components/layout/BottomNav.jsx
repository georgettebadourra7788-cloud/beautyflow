import { NavLink } from "react-router-dom";
import MaterialIcon from "../icons/MaterialIcon.jsx";

const ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/leads", label: "Leads", icon: "person_search" },
  { to: "/conversations", label: "Conversations", icon: "chat_bubble" },
  { to: "/opportunities", label: "Opportunities", icon: "auto_graph" },
];

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 pb-safe bg-surface-container-lowest shadow-[0px_-10px_30px_rgba(45,45,45,0.05)] rounded-t-xl border-t border-surface-variant/50">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center px-4 py-1 rounded-full transition-all duration-150 ${
              isActive
                ? "bg-primary-container text-on-primary-container scale-90"
                : "text-on-secondary-container hover:bg-surface-variant/50"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <MaterialIcon name={item.icon} filled={isActive} className="mb-1" />
              <span className="font-label-sm text-label-sm">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
      <NavLink
        to="/more"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center px-4 py-1 rounded-full transition-all duration-150 ${
            isActive
              ? "bg-primary-container text-on-primary-container scale-90"
              : "text-on-secondary-container hover:bg-surface-variant/50"
          }`
        }
      >
        <MaterialIcon name="more_horiz" className="mb-1" />
        <span className="font-label-sm text-label-sm">More</span>
      </NavLink>
    </nav>
  );
}
