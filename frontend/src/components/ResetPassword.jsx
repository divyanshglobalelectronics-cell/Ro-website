import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialToken = params.get('token') || '';

  const [form, setForm] = useState({ token: initialToken, password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: form.token, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reset failed');
      setMessage('Password has been reset. You can now login.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (e) {
      setError(e.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
      {message && <p className="mt-3 text-green-700 bg-green-50 border border-green-100 rounded p-3">{message}</p>}
      {error && <p className="mt-3 text-red-700 bg-red-50 border border-red-100 rounded p-3">{error}</p>}
      <form onSubmit={submit} className="mt-6 bg-white border rounded p-6 space-y-4">
        {/* Do not display the token value. If token is present in the URL we use it silently. */}
        {!initialToken && (
          <div>
            <label className="block text-sm text-gray-700">Reset Token (from email)</label>
            {/* masked input so token is not shown in plain text */}
            <input
              type="password"
              className="mt-1 w-full border rounded px-3 py-2"
              required
              placeholder="Paste token from email"
              value={form.token}
              onChange={(e) => setForm({ ...form, token: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">If you clicked the link from your email the token is already set and will be used automatically.</p>
          </div>
        )}
        <div>
          <label className="block text-sm text-gray-700">New Password</label>
          <input type="password" className="mt-1 w-full border rounded px-3 py-2" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Confirm Password</label>
          <input type="password" className="mt-1 w-full border rounded px-3 py-2" required value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
        </div>
        <button type="submit" disabled={loading} className="w-full px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded">
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}
