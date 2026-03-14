import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fromPath = useMemo(() => location.state?.from?.pathname || '/overview', [location.state]);

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
    <div className="mesh-bg relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,240,220,0.25),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(67,105,255,0.3),transparent_40%)]" aria-hidden="true" />

      <div className="glass-panel relative z-10 w-full max-w-md p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/85">Laravel Connected</p>
        <h1 className="mt-2 text-3xl font-bold text-cyan-50">Welcome Back</h1>
        <p className="mt-2 text-sm text-slate-300">Sign in to access your academic intelligence dashboard.</p>

        {serverError && (
          <div className="mt-5 rounded-xl border border-rose-300/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-100" role="alert">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-200" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className={`input-glow w-full rounded-xl border bg-slate-950/35 px-3 py-2.5 text-sm text-white outline-none transition ${errors.email ? 'border-rose-300/60' : 'border-cyan-200/25'}`}
              placeholder="name@example.com"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              disabled={isSubmitting}
            />
            {errors.email && <p className="mt-1 text-xs text-rose-200">{errors.email}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-200" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className={`input-glow w-full rounded-xl border bg-slate-950/35 px-3 py-2.5 text-sm text-white outline-none transition ${errors.password ? 'border-rose-300/60' : 'border-cyan-200/25'}`}
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
