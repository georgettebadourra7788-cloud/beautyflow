import { Navigate } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function RequireLanguageChosen({ children }) {
  const { hasChosenLanguage } = useLanguage();
  if (!hasChosenLanguage) return <Navigate to="/language" replace />;
  return children;
}
