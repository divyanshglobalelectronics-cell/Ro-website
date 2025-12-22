import { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      //calling backend api to send the reset link on the email
      const res = await fetch('/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setMessage('If the email exists, a reset link has been sent.');
    } catch (e) {
      setError(e.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
      {message && <p className="mt-3 text-green-700 bg-green-50 border border-green-100 rounded p-3">{message}</p>}
      {error && <p className="mt-3 text-red-700 bg-red-50 border border-red-100 rounded p-3">{error}</p>}
      <form onSubmit={submit} className="mt-6 bg-white border rounded p-6 space-y-4">
        <div>
          <label className="block text-sm text-gray-700">Email</label>
          <input type="email" className="mt-1 w-full border rounded px-3 py-2" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button type="submit" disabled={loading} className="w-full px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded">
          {loading ? 'Sending...' : 'Send reset link'}
        </button>
      </form>
    </div>
  );
}
