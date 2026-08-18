import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FloatingInput from "../../components/FloatingInput.jsx";
import MaterialIcon from "../../components/icons/MaterialIcon.jsx";
import { useAuth } from "../../lib/AuthContext.jsx";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import LanguageToggle from "../../components/LanguageToggle.jsx";

export default function SignUp() {
  const { signUp, isSupabaseConfigured } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError(t("auth.signup.passwordTooShort"));
      return;
    }
    setSubmitting(true);
    const { data, error: signUpError } = await signUp(email, password, fullName);
    setSubmitting(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    if (data.session) {
      navigate("/onboarding/salon-info", { replace: true });
    } else {
      setNeedsConfirmation(true);
    }
  };

  if (needsConfirmation) {
    return (
      <div className="min-h-screen bg-surface flex flex-col justify-center px-container-padding">
        <LanguageToggle className="fixed top-6 end-6 z-50" />
        <div className="w-full max-w-sm mx-auto text-center bg-surface-container-lowest rounded-[24px] p-8 soft-shadow border border-outline-variant/30">
          <MaterialIcon name="mark_email_read" filled className="text-5xl text-primary mb-stack-md" />
          <h1 className="font-headline-lg text-headline-lg text-primary mb-stack-sm">{t("auth.signup.checkEmailTitle")}</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-lg">
            {(() => {
              const [before, after] = t("auth.signup.checkEmailBody").split("{{email}}");
              return (
                <>
                  {before}
                  <span className="font-semibold text-on-surface">{email}</span>
                  {after}
                </>
              );
            })()}
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 w-full bg-primary-container text-on-primary-container font-label-lg text-label-lg py-4 rounded-xl hover:opacity-90 transition-opacity"
          >
            {t("auth.signup.goToLogin")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center px-container-padding">
      <LanguageToggle className="fixed top-6 end-6 z-50" />
      <div className="w-full max-w-sm mx-auto">
        <div className="mb-stack-lg text-center">
          <div className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-primary-container text-on-primary-container mb-stack-md font-headline-md text-headline-md tracking-tight">
            BeautyFlow
          </div>
          <h1 className="font-display text-[34px] leading-tight text-primary mb-stack-sm">{t("auth.signup.title")}</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">{t("auth.signup.subtitle")}</p>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-stack-md bg-error-container text-on-error-container rounded-xl p-4 font-body-md text-body-md">
            {t("auth.supabaseNotConfigured", {
              urlVar: "VITE_SUPABASE_URL",
              keyVar: "VITE_SUPABASE_ANON_KEY",
            })}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-[24px] p-6 soft-shadow border border-outline-variant/30 space-y-stack-md">
          <FloatingInput
            id="fullName"
            label={t("auth.signup.fullNameLabel")}
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <FloatingInput
            id="email"
            label={t("auth.signup.emailLabel")}
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FloatingInput
            id="password"
            label={t("auth.signup.passwordLabel")}
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="font-body-md text-body-md text-error">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !isSupabaseConfigured}
            className="w-full bg-primary-container text-on-primary-container font-label-lg text-label-lg py-4 rounded-xl flex justify-center items-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {submitting ? t("auth.signup.submitting") : t("auth.signup.submit")}
            {!submitting && <MaterialIcon name="arrow_forward" className="text-[18px]" />}
          </button>
        </form>

        <p className="text-center mt-stack-lg font-body-md text-body-md text-on-surface-variant">
          {t("auth.signup.haveAccount")}{" "}
          <Link to="/login" className="text-primary font-semibold hover:opacity-80 transition-opacity">
            {t("auth.signup.login")}
          </Link>
        </p>
      </div>
    </div>
  );
}
