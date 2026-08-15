import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FloatingInput from "../../components/FloatingInput.jsx";
import MaterialIcon from "../../components/icons/MaterialIcon.jsx";
import { useAuth } from "../../lib/AuthContext.jsx";

export default function Login() {
  const { signIn, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { error: signInError } = await signIn(email, password);
    setSubmitting(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    navigate(location.state?.from?.pathname ?? "/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center px-container-padding">
      <div className="w-full max-w-sm mx-auto">
        <div className="mb-stack-lg text-center">
          <div className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-primary-container text-on-primary-container mb-stack-md font-headline-md text-headline-md tracking-tight">
            BeautyFlow
          </div>
          <h1 className="font-display text-[34px] leading-tight text-primary mb-stack-sm">Welcome back</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Log in to your BeautyFlow workspace.</p>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-stack-md bg-error-container text-on-error-container rounded-xl p-4 font-body-md text-body-md">
            Supabase isn't configured yet. Set <code>VITE_SUPABASE_URL</code> and{" "}
            <code>VITE_SUPABASE_ANON_KEY</code> in your <code>.env.local</code> file, then restart the dev server.
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-[24px] p-6 soft-shadow border border-outline-variant/30 space-y-stack-md">
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
            autoComplete="current-password"
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
            {submitting ? "Logging in…" : "LOG IN"}
            {!submitting && <MaterialIcon name="arrow_forward" className="text-[18px]" />}
          </button>
        </form>

        <p className="text-center mt-stack-lg font-body-md text-body-md text-on-surface-variant">
          New to BeautyFlow?{" "}
          <Link to="/signup" className="text-primary font-semibold hover:opacity-80 transition-opacity">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
