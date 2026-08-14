import { Navigate } from "react-router-dom";
import { useSalon } from "../lib/SalonContext.jsx";
import LoadingScreen from "./LoadingScreen.jsx";

export default function RequireSalon({ children }) {
  const { salon, loading } = useSalon();

  if (loading) return <LoadingScreen />;
  if (!salon) return <Navigate to="/onboarding/salon-info" replace />;
  return children;
}
