import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate(location.state?.from || '/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Giriş uğursuz oldu');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="w-full max-w-[400px] bg-white rounded-[20px] shadow-[0_18px_34px_-28px_rgba(36,21,18,.3)] p-8">
        <div className="font-display font-bold text-xl mb-1">Savora</div>
        <p className="text-muted text-sm mb-6">Admin panelə giriş</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            required
            placeholder="E-poçt"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className="border border-ink/15 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-maroon"
          />
          <input
            type="password"
            required
            placeholder="Şifrə"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            className="border border-ink/15 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-maroon"
          />

          {error && <p className="text-brick text-[13.5px]">{error}</p>}

          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Daxil olunur...' : 'Daxil ol'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
