import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useNavigate } from 'react-router-dom';
import Loader from '../../common/Loader.jsx';

export default function Profile() {
  const { user, loading, syncUser, token, logout } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', addressLine1: '', city: '', state: '', zip: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('overview');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [ordersCount, setOrdersCount] = useState(0);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (!token || deleting) return;
    setDeleting(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to delete account');
      showToast('Account deleted', { type: 'success' });
      setConfirmOpen(false);
      logout();
    } catch (e) {
      showToast(e.message || 'Failed to delete account', { type: 'error' });
      setError(e.message || 'Failed to delete account');
    } finally {
      setDeleting(false);
    }
  };

  const initials = useMemo(() => {
    const src = user?.name || user?.email || '';
    const parts = src.trim().split(/\s+/).slice(0, 2);
    return parts.map(p => p[0] ? p[0].toUpperCase() : '').join('') || 'U';
  }, [user]);

  const joined = useMemo(() => {
    const d = user?.createdAt ? new Date(user.createdAt) : null;
    return d && !isNaN(d) ? d.toLocaleDateString() : null;
  }, [user]);

  const displayPhone = useMemo(() => {
    return (
      user?.phone || user?.mobile || user?.phoneNumber || user?.contactNumber || user?.contact || ''
    ) || '—';
  }, [user]);

  const displayAddress = useMemo(() => {
    const line = user?.address?.line1
      || (typeof user?.address === 'string' ? user.address : '')
      || user?.addressLine1
      || '';
    const city = user?.address?.city || user?.city || '';
    const state = user?.address?.state || user?.state || '';
    const zip = user?.address?.zip || user?.zip || user?.zipCode || user?.pincode || user?.postalCode || '';
    const first = line || '—';
    const second = [city, state].filter(Boolean).join(', ');
    const third = zip ? `${zip}` : '';
    return { first, second, third };
  }, [user]);

  useEffect(() => {
    if (!loading) {
      if (!user) navigate(`/login?returnTo=${encodeURIComponent('/profile')}`);
      else setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        addressLine1: user?.address?.line1 || (typeof user?.address === 'string' ? user.address : '') || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        zip: user?.address?.zip || '',
      });
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    let aborted = false;
    async function loadOrdersCount() {
      if (!token || !user) return;
      setOrdersLoading(true);
      try {
        const res = await fetch('/api/orders/mine', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed to load orders');
        if (!aborted) setOrdersCount(Array.isArray(data) ? data.length : 0);
      } catch (e) {
        if (!aborted) setOrdersCount(0);
      } finally {
        if (!aborted) setOrdersLoading(false);
      }
    }
    loadOrdersCount();
    return () => { aborted = true; };
  }, [token, user]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        address: (form.addressLine1 || form.city || form.state || form.zip)
          ? { line1: form.addressLine1 || '', city: form.city || '', state: form.state || '', zip: form.zip || '' }
          : undefined,
      };
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('auth:token') ? `Bearer ${localStorage.getItem('auth:token')}` : '' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      setMessage('Profile updated');
      showToast('Profile updated', { type: 'success' });
      if (data.user) syncUser(data.user);
    } catch (e) {
      setError(e.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading profile..." />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#484b8b] to-[#1b083a]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white border rounded-xl p-6 sm:p-8 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-semibold">
            {initials}
          </div>
          <div>
            <div className="text-xl font-semibold text-gray-900">{user?.name || 'User'}</div>
            <div className="text-sm text-gray-600">{user?.email}</div>
            {joined && <div className="text-xs text-gray-500 mt-0.5">Joined on {joined}</div>}
          </div>
        </div>

        <div className="mt-6 border-b flex gap-4">
          <button onClick={() => setTab('overview')} className={`px-3 py-2 text-sm ${tab === 'overview' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-600 hover:text-gray-800'}`}>Overview</button>
          <button onClick={() => setTab('edit')} className={`px-3 py-2 text-sm ${tab === 'edit' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-600 hover:text-gray-800'}`}>Edit</button>
        </div>

        {message && <p className="mt-4 px-4 py-3 text-green-700 bg-green-50 border border-green-200 rounded-lg font-medium">✓ {message}</p>}
        {error && <p className="mt-4 px-4 py-3 text-red-700 bg-red-50 border border-red-200 rounded-lg font-medium">✗ {error}</p>}

        {tab === 'overview' && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
              <div className="text-xs font-bold uppercase text-gray-900 tracking-wider">🧾 Total Orders</div>
              <div className="mt-2 text-gray-900 text-xl font-semibold">{ordersLoading ? '—' : ordersCount}</div>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
              <div className="text-xs font-bold uppercase text-gray-900 tracking-wider">📞 Phone</div>
              <div className="mt-2 text-gray-500">{displayPhone}</div>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
              <div className="text-xs font-bold uppercase text-gray-900 tracking-wider">📞Email</div>
              <div className="mt-2 text-gray-500">{user?.email || '—'}</div>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
              <div className="text-xs uppercase font-bold text-gray-900 tracking-wider">📍 Address</div>
              <div className="mt-2">
                <div className=" text-gray-500">{displayAddress.first}</div>
                {(displayAddress.second || displayAddress.third) && (
                  <div className="text-sm text-gray-500 mt-1">{displayAddress.second}{displayAddress.third ? ` ${displayAddress.third}` : ''}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === 'edit' && (
          <form onSubmit={submit} className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
                <input className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ZIP</label>
                <input className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button type="submit" disabled={saving} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-md disabled:opacity-60 transition-all">
                {saving ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
              <button type="button" disabled={saving} onClick={() => setForm({
                name: user?.name || '',
                email: user?.email || '',
                phone: user?.phone || '',
                addressLine1: user?.address?.line1 || (typeof user?.address === 'string' ? user.address : '') || '',
                city: user?.address?.city || '',
                state: user?.address?.state || '',
                zip: user?.address?.zip || '',
              })} className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors">
                Reset
              </button>
            </div>
          </form>
        )}
        {/* Danger Zone */}
        <div className="mt-10 p-5 border rounded-xl bg-red-50 border-red-200">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-red-700 font-bold">Delete Account</div>
              <div className="text-sm text-red-700/80">This action is permanent and cannot be undone.</div>
            </div>
            <button type="button" onClick={() => setConfirmOpen(true)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
              Delete Account
            </button>
          </div>
        </div>

        {confirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => !deleting && setConfirmOpen(false)} />
            <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-gray-900">Are you sure you want to delete?</h3>
              <p className="mt-2 text-sm text-gray-600">This will permanently remove your account and data.</p>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" disabled={deleting} onClick={() => setConfirmOpen(false)} className="px-4 py-2 rounded border">
                  Cancel
                </button>
                <button type="button" disabled={deleting} onClick={handleDeleteAccount} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
 </div>
);
}
