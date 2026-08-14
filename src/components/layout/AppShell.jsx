import BottomNav from "./BottomNav.jsx";
import SideNav from "./SideNav.jsx";

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-surface">
      <SideNav />
      <div className="md:pl-20">
        <div className="w-full max-w-md md:max-w-3xl mx-auto bg-surface-bright min-h-screen relative shadow-2xl md:shadow-none overflow-x-hidden">
          {children}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
