import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext.jsx";
import { useSalon } from "../lib/SalonContext.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import LoadingScreen from "./LoadingScreen.jsx";

export default function RootRedirect() {
  const { user, loading: authLoading } = useAuth();
  const { salon, loading: salonLoading } = useSalon();
  const { hasChosenLanguage } = useLanguage();

  if (authLoading) return <LoadingScreen />;
  if (!user) {
    // Only unauthenticated visitors go through the first-run language
    // screen - an existing session shouldn't be interrupted by it.
    if (!hasChosenLanguage) return <Navigate to="/language" replace />;
    return <Navigate to="/login" replace />;
  }
  if (salonLoading) return <LoadingScreen />;
  if (!salon) return <Navigate to="/onboarding/salon-info" replace />;
  return <Navigate to="/dashboard" replace />;
}
