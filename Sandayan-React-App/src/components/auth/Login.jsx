import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import fallbackLogo from '../../assets/react.svg';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BRAND_IMAGE_SRC = '/brand/SandayanAcademy.png';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fromPath = useMemo(() => location.state?.from?.pathname || '/overview', [location.state]);

  const handleBrandImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallbackLogo;
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!emailRegex.test(form.email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!form.password) {
      nextErrors.password = 'Password is required.';
    } else if (form.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login(form.email.trim(), form.password);
      navigate(fromPath, { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to sign in. Please check your credentials.';
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      <img
        src={BRAND_IMAGE_SRC}
        alt="Sandayan Academy background"
        className="absolute inset-0 h-full w-full object-cover brightness-110 saturate-125"
        onError={handleBrandImageError}
      />
      <div className="absolute inset-0 bg-slate-950/30" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(56,240,220,0.16),transparent_45%),radial-gradient(circle_at_78%_12%,rgba(67,105,255,0.22),transparent_45%)]" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950/55" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-cyan-200/30 bg-slate-900/18 p-6 shadow-[0_18px_44px_rgba(1,8,30,0.4)] backdrop-blur-xl sm:p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-cyan-50">Welcome</h1>
        </div>

        <p className="mt-2 text-center text-sm text-slate-200">Sign in to access your academic intelligence dashboard.</p>

        {serverError && (
          <div className="mt-5 rounded-xl border border-rose-300/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-100" role="alert">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-100" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className={`input-glow w-full rounded-xl border bg-slate-950/35 px-3 py-2.5 text-sm text-white outline-none transition ${errors.email ? 'border-rose-300/60' : 'border-cyan-200/30'}`}
              placeholder="name@example.com"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              disabled={isSubmitting}
            />
            {errors.email && <p className="mt-1 text-xs text-rose-200">{errors.email}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-100" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className={`input-glow w-full rounded-xl border bg-slate-950/35 px-3 py-2.5 text-sm text-white outline-none transition ${errors.password ? 'border-rose-300/60' : 'border-cyan-200/30'}`}
              placeholder="Enter your password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              disabled={isSubmitting}
            />
            {errors.password && <p className="mt-1 text-xs text-rose-200">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_8px_28px_rgba(59,223,255,0.45)] transition duration-300 hover:scale-[1.015] hover:shadow-[0_8px_34px_rgba(59,223,255,0.65)] disabled:cursor-not-allowed disabled:opacity-65"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
