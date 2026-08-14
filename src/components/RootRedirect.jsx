import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext.jsx";
import { useSalon } from "../lib/SalonContext.jsx";
import LoadingScreen from "./LoadingScreen.jsx";

export default function RootRedirect() {
  const { user, loading: authLoading } = useAuth();
  const { salon, loading: salonLoading } = useSalon();

  if (authLoading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (salonLoading) return <LoadingScreen />;
  if (!salon) return <Navigate to="/onboarding/salon-info" replace />;
  return <Navigate to="/dashboard" replace />;
}
