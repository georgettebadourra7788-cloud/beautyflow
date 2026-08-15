import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FloatingInput from "../../components/FloatingInput.jsx";
import MaterialIcon from "../../components/icons/MaterialIcon.jsx";
import { useAuth } from "../../lib/AuthContext.jsx";

export default function SignUp() {
  const { signUp, isSupabaseConfigured } = useAuth();
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
      setError("Password must be at least 6 characters.");
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
        <div className="w-full max-w-sm mx-auto text-center bg-surface-container-lowest rounded-[24px] p-8 soft-shadow border border-outline-variant/30">
          <MaterialIcon name="mark_email_read" filled className="text-5xl text-primary mb-stack-md" />
          <h1 className="font-headline-lg text-headline-lg text-primary mb-stack-sm">Check your email</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-lg">
            We sent a confirmation link to <span className="font-semibold text-on-surface">{email}</span>. Confirm
            your address, then log in to set up your salon.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 w-full bg-primary-container text-on-primary-container font-label-lg text-label-lg py-4 rounded-xl hover:opacity-90 transition-opacity"
          >
            Go to Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center px-container-padding">
      <div className="w-full max-w-sm mx-auto">
        <div className="mb-stack-lg text-center">
          <div className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-primary-container text-on-primary-container mb-stack-md font-headline-md text-headline-md tracking-tight">
            BeautyFlow
          </div>
          <h1 className="font-display text-[34px] leading-tight text-primary mb-stack-sm">Create your account</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Start recovering missed bookings.</p>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-stack-md bg-error-container text-on-error-container rounded-xl p-4 font-body-md text-body-md">
            Supabase isn't configured yet. Set <code>VITE_SUPABASE_URL</code> and{" "}
            <code>VITE_SUPABASE_ANON_KEY</code> in your <code>.env.local</code> file, then restart the dev server.
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-[24px] p-6 soft-shadow border border-outline-variant/30 space-y-stack-md">
          <FloatingInput
            id="fullName"
            label="Full Name"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <FloatingInput
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FloatingInput
            id="password"
            label="Password"
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
            {submitting ? "Creating account…" : "SIGN UP"}
            {!submitting && <MaterialIcon name="arrow_forward" className="text-[18px]" />}
          </button>
        </form>

        <p className="text-center mt-stack-lg font-body-md text-body-md text-on-surface-variant">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:opacity-80 transition-opacity">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
