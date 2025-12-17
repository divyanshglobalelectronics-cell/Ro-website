import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import AdminProducts from './AdminProducts.jsx';
import { apiGet, apiPut, apiDelete } from '../../api/client.js';

export default function AdminDashboard() {
    const { user, token, loading } = useAuth();
    const [tab, setTab] = useState('products');
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [refunds, setRefunds] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [analyticsData, setAnalyticsData] = useState(null);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);
    const [error, setError] = useState('');
    const [newUserForm, setNewUserForm] = useState({ name: '', email: '', password: '', isAdmin: false });
    const [creatingUser, setCreatingUser] = useState(false);
    const [flip, setFlip] = useState(false);
    const [range, setRange] = useState('30d');
    const [trendMetric, setTrendMetric] = useState('revenue'); // 'revenue' | 'orders'
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [orderStatusFilter, setOrderStatusFilter] = useState('all'); // all|pending|confirmed|shipped|delivered|cancelled
    const [orderPaidFilter, setOrderPaidFilter] = useState('all'); // all|paid|unpaid
    const [orderSortBy, setOrderSortBy] = useState('date'); // date|total
    const [orderSortDir, setOrderSortDir] = useState('desc'); // asc|desc
    const [usersPage, setUsersPage] = useState(1);
    const [usersPageSize, setUsersPageSize] = useState(10);
    const [ordersPage, setOrdersPage] = useState(1);
    const [ordersPageSize, setOrdersPageSize] = useState(10);
    const [viewOpen,setViewOpen] = useState(false);

    function viewHandler(){
        // console.log(viewOpen);
        setViewOpen(!viewOpen);
    }

    async function createUser(e) {
        e.preventDefault();
        if (!newUserForm.name || !newUserForm.email || !newUserForm.password) {
            setError('Name, email, and password are required');
            return;
        }
        setCreatingUser(true);
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newUserForm.name,
                    email: newUserForm.email,
                    password: newUserForm.password,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to create user');
            // If admin toggle is on, update user to admin
            if (newUserForm.isAdmin) {
                const updated = await apiPut(`/api/admin/users/${data.user.id}`, { isAdmin: true }, token);
                setUsers(prev => [updated, ...prev]);
            } else {
                setUsers(prev => [data.user, ...prev]);
            }
            setNewUserForm({ name: '', email: '', password: '', isAdmin: false });
            setError('');
        } catch (e) {
            setError(e.message || 'Failed to create user');
        } finally {
            setCreatingUser(false);
        }
    }

    async function loadAll() {
        setLoadingData(true);
        setFlip(true);
        try {
            const [u, o, r] = await Promise.all([
                apiGet('/api/admin/users', token),
                apiGet('/api/admin/orders', token),
                // apiGet('/api/admin/refunds', token),
            ]);
            setUsers(u);
            setOrders(o);
            setRefunds(r);
        } catch (e) {
            setError(e.message || 'Failed to load admin data');
        } finally {
            setLoadingData(false);
            setTimeout(() => setFlip(false), 1000);
        }
    }

    async function loadAnalytics() {
        setAnalyticsLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('range', range || 'all');
            if (range === 'custom') {
                if (startDate) params.set('startDate', startDate);
                if (endDate) params.set('endDate', endDate);
            }
            params.set('group', 'month');
            params.set('includeCancelled', 'false');
            const qs = params.toString();
            const url = `/api/admin/analytics${qs ? ('?' + qs) : ''}`;
            const data = await apiGet(url, token);
            setAnalyticsData(data);
        } catch (e) {
            // Keep client-side fallback if server analytics fails
            console.warn('Analytics API failed, using client-side fallback:', e?.message || e);
        } finally {
            setAnalyticsLoading(false);
        }
    }

    React.useEffect(() => {
        loadAll();
        loadAnalytics();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Reload analytics when filters change
    React.useEffect(() => {
        loadAnalytics();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [range, startDate, endDate]);

    // Persist Orders filters/sort in localStorage
    React.useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('admin:ordersTable') || '{}');
            if (saved && typeof saved === 'object') {
                if (saved.status) setOrderStatusFilter(saved.status);
                if (saved.paid) setOrderPaidFilter(saved.paid);
                if (saved.sortBy) setOrderSortBy(saved.sortBy);
                if (saved.sortDir) setOrderSortDir(saved.sortDir);
                if (saved.pageSize) setOrdersPageSize(saved.pageSize);
            }
        } catch { }
        // do not include setters in deps; run once on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        try {
            const data = {
                status: orderStatusFilter,
                paid: orderPaidFilter,
                sortBy: orderSortBy,
                sortDir: orderSortDir,
                pageSize: ordersPageSize,
            };
            localStorage.setItem('admin:ordersTable', JSON.stringify(data));
        } catch { }
    }, [orderStatusFilter, orderPaidFilter, orderSortBy, orderSortDir, ordersPageSize]);

    // Reset orders page when filters/sort/pageSize change
    React.useEffect(() => {
        setOrdersPage(1);
    }, [orderStatusFilter, orderPaidFilter, orderSortBy, orderSortDir, ordersPageSize]);

    const analytics = React.useMemo(() => {
        const list = Array.isArray(orders) ? orders : [];
        const nonCancelled = list.filter(o => o.status !== 'cancelled');
        const totalOrders = nonCancelled.length;
        const totalRevenue = nonCancelled.reduce((s, o) => s + (o.subtotal || 0), 0);
        const totalItems = nonCancelled.reduce((s, o) => s + (Array.isArray(o.items) ? o.items.reduce((a, it) => a + (it.quantity || 0), 0) : 0), 0);
        const productMap = {};
        nonCancelled.forEach(o => {
            if (!Array.isArray(o.items)) return;
            o.items.forEach(it => {
                const key = String(it.product || it.title || 'unknown');
                const name = it.title || key;
                if (!productMap[key]) productMap[key] = { name, qty: 0, revenue: 0 };
                productMap[key].qty += it.quantity || 0;
                productMap[key].revenue += (it.price || 0) * (it.quantity || 0);
            });
        });
        const mostSold = Object.values(productMap).sort((a, b) => b.qty - a.qty).slice(0, 5);
        const aov = totalOrders ? totalRevenue / totalOrders : 0;
        const byPayment = nonCancelled.reduce((acc, o) => {
            const k = o.paymentMethod || 'unknown';
            acc[k] = (acc[k] || 0) + (o.subtotal || 0);
            return acc;
        }, {});
        const byMonth = {};
        nonCancelled.forEach(o => {
            const d = o.createdAt ? new Date(o.createdAt) : null;
            if (!d) return;
            const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            byMonth[k] = (byMonth[k] || 0) + (o.subtotal || 0);
        });
        const months = Object.keys(byMonth).sort().slice(-6);
        const trend = months.map(m => ({ month: m, revenue: byMonth[m] }));
        return { totalOrders, totalRevenue, totalItems, mostSold, aov, byPayment, trend };
    }, [orders]);

    function downloadCSV(filename, rows) {
        const csv = rows.map(r => r.map(v => {
            const s = String(v ?? '');
            if (s.includes(',') || s.includes('"') || s.includes('\n')) {
                return '"' + s.replace(/"/g, '""') + '"';
            }
            return s;
        }).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }

    async function handleDownloadInvoice(orderId) {
        try {
            const res = await fetch(`/api/admin/orders/${orderId}/invoice.pdf`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Failed to download invoice');
            }
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice_${orderId}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (e) {
            setError(e.message || 'Failed to download invoice');
        }
    }

    if (loading) return <div className="p-6">Loading auth...</div>;
    if (!user || !user.isAdmin) return <div className="p-6">Unauthorized: Admins only</div>;

    return (
        <div className="p-6 bg-gradient-to-b from-[#484b8b] to-[#1b083a] min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">Admin Dashboard</h1>
                    <button onClick={() => { loadAll(); loadAnalytics(); }} className="px-4 py-2 rounded-md border border-white/20 text-white bg-white/10 hover:bg-white/20 transition shadow-sm">Refresh</button>
                </div>
                <div className={`mb-6 flex flex-wrap gap-2 p-1 items-center justify-center rounded-lg bg-white/10 border border-white/20 backdrop-blur`}>
                    <button onClick={() => setTab('products')} className={`px-4 py-2 rounded-md text-sm md:text-base ${flip ? 'animate-rotateYoyo' : ''} transition shadow-sm ${tab === 'products' ? 'bg-blue-600 text-white' : 'text-white hover:bg-white/20'}`}>Products</button>
                    <button onClick={() => setTab('users')} className={`px-4 py-2 rounded-md text-sm md:text-base ${flip ? 'animate-rotateYoyo' : ''} transition shadow-sm ${tab === 'users' ? 'bg-blue-600 text-white' : 'text-white hover:bg-white/20'}`}>Users</button>
                    <button onClick={() => setTab('orders')} className={`px-4 py-2 rounded-md text-sm md:text-base ${flip ? 'animate-rotateYoyo' : ''} transition shadow-sm ${tab === 'orders' ? 'bg-blue-600 text-white' : 'text-white hover:bg-white/20'}`}>Orders</button>
                    <button onClick={() => setTab('analytics')} className={`px-4 py-2 rounded-md text-sm md:text-base ${flip ? 'animate-rotateYoyo' : ''} transition shadow-sm ${tab === 'analytics' ? 'bg-blue-600 text-white' : 'text-white hover:bg-white/20'}`}>Analytics</button>
                </div>
            </div>

            {error && <div className="mb-4 text-red-600">{error}</div>}

            {tab === 'products' && <AdminProducts />}

            {tab === 'users' && (
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-xl font-semibold mb-4">Users ({users.length})</h2>

                    {/* Add User Form */}
                    <div className="mb-6 bg-white border rounded-lg p-5">
                        <h3 className="font-bold text-lg mb-3">Add New User</h3>
                        <form onSubmit={createUser} className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="border rounded px-3 py-2"
                                    value={newUserForm.name}
                                    onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="border rounded px-3 py-2"
                                    value={newUserForm.email}
                                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="border rounded px-3 py-2"
                                    value={newUserForm.password}
                                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                                    required
                                />
                            </div>

                            <button type="submit" disabled={creatingUser} className="px-4 py-2 bg-green-600 hover:bg-blue-600 text-white rounded">
                                {creatingUser ? 'Creating...' : 'Create User'}
                            </button>
                        </form>
                    </div>

                    <h3 className="font-bold text-lg mb-3">All Users</h3>
                    <div className="overflow-auto rounded-lg border border-white/20 bg-white/5">
                        <table className="min-w-full text-sm">
                            <thead className="sticky top-0 bg-white/80 backdrop-blur text-gray-700">
                                <tr>
                                    <th className="text-left font-semibold px-4 py-2">User</th>
                                    <th className="text-left font-semibold px-4 py-2 hidden md:table-cell">Email</th>
                                    <th className="text-left font-semibold px-4 py-2 hidden md:table-cell">Role</th>
                                    <th className="text-right font-semibold px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id} className="odd:bg-white/70 even:bg-white/60">
                                        <td className="px-4 py-2">
                                            <div className="flex items-center gap-2">
                                                <img src={`https://api.dicebear.com/5.x/initials/svg?rotate=90&seed=${u.name}`} alt={`${u.name}`} className='rounded-full h-8 w-8' />
                                                <div>
                                                    <div className="font-semibold text-gray-900">{u.name}</div>
                                                    <div className="text-xs text-gray-600 md:hidden">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 hidden md:table-cell text-gray-800">{u.email}</td>
                                        <td className="px-4 py-2 hidden md:table-cell">
                                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${u.isAdmin ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{u.isAdmin ? 'admin' : 'user'}</span>
                                            {u.isBlocked && <span className="ml-2 px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700">blocked</span>}
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            <div className="inline-flex gap-2">
                                                {u.isAdmin && (
                                                    <button onClick={async () => {
                                                        const payload = { isAdmin: !u.isAdmin };
                                                        try {
                                                            const res = await apiPut(`/api/admin/users/${u._id}`, payload, token);
                                                            setUsers(prev => prev.map(x => x._id === res._id ? res : x));
                                                        } catch (e) { setError(e.message || 'Failed'); }
                                                    }} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-red-600">Remove Admin</button>
                                                )}
                                                <button onClick={async () => {
                                                    const payload = { isBlocked: !u.isBlocked };
                                                    try {
                                                        const res = await apiPut(`/api/admin/users/${u._id}`, payload, token);
                                                        setUsers(prev => prev.map(x => x._id === res._id ? res : x));
                                                    } catch (e) { setError(e.message || 'Failed'); }
                                                }} className={`px-3 py-1 rounded ${u.isBlocked ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>{u.isBlocked ? 'Unblock' : 'Block'}</button>
                                                <button onClick={async () => {
                                                    if (!window.confirm('Are you sure you want to delete this user?')) return;
                                                    try {
                                                        await apiDelete(`/api/admin/users/${u._id}`, token);
                                                        setUsers(prev => prev.filter(x => x._id !== u._id));
                                                    } catch (e) { setError(e.message || 'Failed'); }
                                                }} className="px-3 py-1 bg-gray-300 text-gray-800 rounded">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {tab === 'orders' && (
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-xl font-semibold mb-2">Orders ({orders.length})</h2>
                    <div className="mb-3 flex flex-wrap gap-2 items-center text-sm">
                        <label className="text-white/80">Status</label>
                        <select value={orderStatusFilter} onChange={(e) => setOrderStatusFilter(e.target.value)} className="border p-1.5 rounded bg-white/80">
                            <option value="all">All</option>
                            <option value="pending">pending</option>
                            <option value="confirmed">confirmed</option>
                            <option value="shipped">shipped</option>
                            <option value="delivered">delivered</option>
                            <option value="cancelled">cancelled</option>
                        </select>
                        <label className="text-white/80 ml-3">Paid</label>
                        <select value={orderPaidFilter} onChange={(e) => setOrderPaidFilter(e.target.value)} className="border p-1.5 rounded bg-white/80">
                            <option value="all">All</option>
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
                        </select>
                        <div className="ml-auto flex gap-2 items-center">
                            <label className="text-white/80">Sort</label>
                            <select value={orderSortBy} onChange={(e) => setOrderSortBy(e.target.value)} className="border p-1.5 rounded bg-white/80">
                                <option value="date">Date</option>
                                <option value="total">Total</option>
                            </select>
                            <button onClick={() => setOrderSortDir(d => d === 'asc' ? 'desc' : 'asc')} className="px-2 py-1 rounded border bg-white hover:bg-gray-100">{orderSortDir === 'asc' ? 'Asc' : 'Desc'}</button>
                            <button
                                onClick={() => { setOrderStatusFilter('all'); setOrderPaidFilter('all'); setOrderSortBy('date'); setOrderSortDir('desc'); }}
                                className="px-3 py-1 rounded border bg-white hover:bg-gray-100"
                            >Clear</button>
                        </div>
                    </div>
                    <div className="overflow-auto rounded-lg border border-white/20 bg-white/5">
                        <table className="min-w-full text-sm">
                            <thead className="sticky top-0 bg-white/80 backdrop-blur text-gray-700">
                                <tr>
                                    <th className="text-left font-semibold px-4 py-2">Order</th>
                                    <th className="text-left font-semibold px-4 py-2 hidden md:table-cell">Customer</th>
                                    <th className="text-left font-semibold px-4 py-2 hidden lg:table-cell">Email</th>
                                    <th className="text-left font-semibold px-4 py-2">Total</th>
                                    <th className="text-left font-semibold px-4 py-2 hidden md:table-cell">Paid</th>
                                    <th className="text-left font-semibold px-4 py-2 hidden lg:table-cell">Date</th>
                                    <th className="text-right font-semibold px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(() => {
                                    const list = Array.isArray(orders) ? orders.slice() : [];
                                    const filtered = list.filter(o => {
                                        if (orderStatusFilter !== 'all' && (o.status || 'unknown') !== orderStatusFilter) return false;
                                        if (orderPaidFilter !== 'all') {
                                            const paidBool = !!o.paid;
                                            if (orderPaidFilter === 'paid' && !paidBool) return false;
                                            if (orderPaidFilter === 'unpaid' && paidBool) return false;
                                        }
                                        return true;
                                    });
                                    filtered.sort((a, b) => {
                                        if (orderSortBy === 'total') {
                                            const av = Number(a.subtotal || 0), bv = Number(b.subtotal || 0);
                                            return orderSortDir === 'asc' ? av - bv : bv - av;
                                        } else {
                                            const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                                            const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                                            return orderSortDir === 'asc' ? ad - bd : bd - ad;
                                        }
                                    });
                                    return filtered;
                                })().map(o => (
                                    <tr key={o._id} className="odd:bg-white/70 even:bg-white/60 align-top">
                                        <td className="px-4 py-2 text-gray-900">
                                            <div className="font-semibold truncate max-w-[160px]">#{o._id}</div>
                                            <div className="text-xs text-gray-600 md:hidden">{new Date(o.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-4 py-2 text-gray-800">{o.customer?.name || '—'}</td>
                                        <td className="px-4 py-2 hidden lg:table-cell text-gray-700">{o.user?.email || o.customer?.email || '—'}</td>
                                        <td className="px-4 py-2 text-gray-900">₹ {Number(o.subtotal || 0).toLocaleString('en-IN')}{o.refunded ? <span className="ml-1 text-xs text-red-600">(−₹{Number(o.refundAmount || 0).toLocaleString('en-IN')})</span> : null}</td>
                                        <td className="px-4 py-2 hidden md:table-cell">
                                            {typeof o.paid === 'boolean' && (
                                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${o.paid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{o.paid ? 'Paid' : 'Pending'}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 hidden lg:table-cell text-gray-700">{o.createdAt ? new Date(o.createdAt).toLocaleString() : '—'}</td>
                                        <td className="px-4 py-2 text-right whitespace-nowrap">
                                            <div className={`${viewOpen===true?"flex flex-col items-center justify-start mx-0":"flex items-center justify-end"}`}>
                                                <div className='flex gap-2 justify-end items-center'>
                                                    <select defaultValue={o.status} onChange={async (e) => {
                                                        try {
                                                            const updated = await apiPut(`/api/admin/orders/${o._id}`, { status: e.target.value }, token);
                                                            setOrders(prev => prev.map(x => x._id === updated._id ? updated : x));
                                                        } catch (e) { setError(e.message || 'Failed'); }
                                                    }} className="border p-1.5 rounded bg-white/80 text-sm">
                                                        <option value="pending">pending</option>
                                                        <option value="confirmed">confirmed</option>
                                                        <option value="shipped">shipped</option>
                                                        <option value="delivered">delivered</option>
                                                        <option value="cancelled">cancelled</option>
                                                    </select>
                                                    {(() => {
                                                        const eligible = o.status !== 'cancelled' && ((o.gateway && o.gateway !== 'cod') || (o.paymentMethod && o.paymentMethod !== 'cod'));
                                                        return (
                                                            <button
                                                                onClick={() => handleDownloadInvoice(o._id)}
                                                                disabled={!eligible}
                                                                className={`px-3 py-1 rounded text-sm ${eligible ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-700 cursor-not-allowed'}`}
                                                            >Invoice</button>
                                                        );
                                                    })()}
                                                </div>
                                                <details className="ml-1">
                                                    <summary className="px-3 py-1 rounded border text-sm bg-white cursor-pointer select-none" onClick={()=>viewHandler()}>View</summary>
                                                    <div className="mt-2 bg-white border rounded p-4 shadow-sm text-left">
                                                        <div className="font-bold text-lg mb-2">Order Details</div>
                                                        <div className="mb-2"><span className="font-semibold">Order ID:</span> {o._id}</div>
                                                        <div className="mb-2"><span className="font-semibold">User:</span> {o.customer?.name}</div>
                                                        <div className="mb-2"><span className="font-semibold">Email:</span> {o.customer?.email}</div>
                                                        <div className="mb-2"><span className="font-semibold">Status:</span> <span className="capitalize">{o.status}</span></div>
                                                        <div className="mb-2">
                                                            <span className="font-semibold">Total:</span> ₹ {Number(o.subtotal || 0).toLocaleString('en-IN')}
                                                            {typeof o.paid === 'boolean' && (
                                                                <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${o.paid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{o.paid ? 'Paid' : 'Pending'}</span>
                                                            )}
                                                        </div>
                                                        {o.customer && (
                                                            <div className="mb-2">
                                                                <span className="font-semibold">Delivery Address:</span>
                                                                <div className="ml-2 inline-block">
                                                                    <div>
                                                                        {o.customer.name && <span>{o.customer.name}, </span>}
                                                                        {o.customer.phone && <span>{o.customer.phone}, </span>}
                                                                        {o.customer.address && <span>{o.customer.address}, </span>}
                                                                        {o.customer.city && <span>{o.customer.city}, </span>}
                                                                        {o.customer.pincode && <span>{o.customer.pincode}</span>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {o.paymentMethod && (
                                                            <div className="mb-2">
                                                                <span className="font-semibold">Payment Method:</span>
                                                                <span className="ml-2 px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700 capitalize">
                                                                    {o.paymentMethod === 'upi' && '📱 UPI'}
                                                                    {o.paymentMethod === 'card' && '💳 Card'}
                                                                    {o.paymentMethod === 'netbanking' && '🏦 Net Banking'}
                                                                    {o.paymentMethod === 'cod' && '📦 Cash on Delivery'}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {o.createdAt && (
                                                            <div className="mb-2"><span className="font-semibold">Order Date:</span> {new Date(o.createdAt).toLocaleString()}</div>
                                                        )}
                                                        {o.items && o.items.length > 0 && (
                                                            <div className="mb-2">
                                                                <span className="font-semibold block mb-2">Products:</span>
                                                                <div className="space-y-3">
                                                                    {o.items.map((p, idx) => (
                                                                        <div key={idx} className="border rounded p-3 bg-gray-50">
                                                                            <div className="flex gap-3">
                                                                                {p.product?.images?.[0] && (
                                                                                    <img src={p.product.images[0]} alt={p.product.title} className="w-16 h-16 object-cover rounded" onError={(e) => e.target.src = '/images/placeholder.svg'} />
                                                                                )}
                                                                                <div className="flex-1">
                                                                                    <div className="font-semibold">{p.product?.title || p.title}</div>
                                                                                    <div className="text-sm text-gray-600">Price: ₹{Number(p.price || 0).toLocaleString('en-IN')}</div>
                                                                                    <div className="text-sm text-gray-600">Quantity: {p.quantity}</div>
                                                                                    <div className="text-sm font-semibold text-blue-600">Total: ₹{Number((p.price || 0) * p.quantity).toLocaleString('en-IN')}</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {o.notes && <div className="mb-2"><span className="font-semibold">Notes:</span> {o.notes}</div>}
                                                        {o.trackingId && <div className="mb-2"><span className="font-semibold">Tracking ID:</span> {o.trackingId}</div>}
                                                        <div className="text-xs text-gray-400 mt-2">Created: {o.createdAt ? new Date(o.createdAt).toLocaleString() : 'N/A'}</div>
                                                    </div>
                                                </details>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {tab === 'analytics' && (
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-xl font-semibold mb-2">Analytics</h2>
                    <div className="mb-4 flex flex-wrap gap-2 items-center">
                        <label className="text-sm text-gray-200">Date range:</label>
                        <select value={range} onChange={(e) => setRange(e.target.value)} className="border p-2 rounded bg-white/80">
                            <option value="7d">Last 7 days</option>
                            <option value="30d">Last 30 days</option>
                            <option value="90d">Last 90 days</option>
                            <option value="all">All time</option>
                            <option value="custom">Custom</option>
                        </select>
                        {range === 'custom' && (
                            <>
                                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border p-2 rounded bg-white/80" />
                                <span className="text-gray-200">to</span>
                                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border p-2 rounded bg-white/80" />
                            </>
                        )}
                    </div>
                    {(analyticsLoading && !analyticsData) && (<div className="mb-3 text-sm text-gray-200">Loading analytics...</div>)}
                    {(!analyticsLoading && !analyticsData && (!orders || orders.length === 0)) && (<div className="mb-3 text-sm text-gray-200">No analytics data available</div>)}
                    {(() => {
                        // Build filtered orders based on selected range
                        const base = Array.isArray(orders) ? orders : [];
                        const now = new Date();
                        let start = null, end = now;
                        if (range === '7d') { start = new Date(); start.setDate(now.getDate() - 6); }
                        else if (range === '30d') { start = new Date(); start.setDate(now.getDate() - 29); }
                        else if (range === '90d') { start = new Date(); start.setDate(now.getDate() - 89); }
                        else if (range === 'custom') {
                            start = startDate ? new Date(startDate + 'T00:00:00') : null;
                            end = endDate ? new Date(endDate + 'T23:59:59') : now;
                        } else { start = null; }
                        const filtered = base.filter(o => {
                            if (!o.createdAt) return start === null; // include if no date when All time
                            const d = new Date(o.createdAt);
                            if (start && d < start) return false;
                            if (end && d > end) return false;
                            return true;
                        });
                        // Compute analytics from filtered list and store in analyticsData
                        const nonCancelled = filtered.filter(o => o.status !== 'cancelled');
                        const totalOrders = nonCancelled.length;
                        const totalRevenue = nonCancelled.reduce((s, o) => s + (o.subtotal || 0), 0);
                        const totalItems = nonCancelled.reduce((s, o) => s + (Array.isArray(o.items) ? o.items.reduce((a, it) => a + (it.quantity || 0), 0) : 0), 0);
                        const productMap = {};
                        nonCancelled.forEach(o => {
                            if (!Array.isArray(o.items)) return;
                            o.items.forEach(it => {
                                const key = String(it.product || it.title || 'unknown');
                                const name = it.title || key;
                                if (!productMap[key]) productMap[key] = { name, qty: 0, revenue: 0 };
                                productMap[key].qty += it.quantity || 0;
                                productMap[key].revenue += (it.price || 0) * (it.quantity || 0);
                            });
                        });
                        const mostSold = Object.values(productMap).sort((a, b) => b.qty - a.qty).slice(0, 5);
                        const aov = totalOrders ? totalRevenue / totalOrders : 0;
                        const byPayment = nonCancelled.reduce((acc, o) => {
                            const k = o.paymentMethod || 'unknown';
                            acc[k] = (acc[k] || 0) + (o.subtotal || 0);
                            return acc;
                        }, {});
                        const byMonth = {};
                        nonCancelled.forEach(o => {
                            const d = o.createdAt ? new Date(o.createdAt) : null;
                            if (!d) return;
                            const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                            byMonth[k] = (byMonth[k] || 0) + (o.subtotal || 0);
                        });
                        const months = Object.keys(byMonth).sort().slice(-6);
                        const trend = months.map(m => ({ month: m, revenue: byMonth[m] }));
                        const server = analyticsData && typeof analyticsData === 'object' ? analyticsData : null;
                        const A2 = server ?? { totalOrders, totalRevenue, totalItems, mostSold, aov, byPayment, trend };
                        return (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-5">
                                    <div className="p-4 border border-white/20 rounded-xl bg-white/80 shadow-sm">
                                        <div className="text-sm text-gray-600">Total Orders</div>
                                        <div className="text-2xl font-bold">{A2.totalOrders}</div>
                                    </div>
                                    <div className="p-4 border border-white/20 rounded-xl bg-white/80 shadow-sm">
                                        <div className="text-sm text-gray-600">Total Items Sold</div>
                                        <div className="text-2xl font-bold">{A2.totalItems}</div>
                                    </div>
                                    <div className="p-4 border border-white/20 rounded-xl bg-white/80 shadow-sm">
                                        <div className="text-sm text-gray-600">Total Revenue</div>
                                        <div className="text-2xl font-bold">₹ {Number(A2.totalRevenue || 0).toLocaleString('en-IN')}</div>
                                    </div>
                                    <div className="p-4 border border-white/20 rounded-xl bg-white/80 shadow-sm">
                                        <div className="text-sm text-gray-600">Avg Order Value</div>
                                        <div className="text-2xl font-bold">₹ {Number(A2.aov || 0).toFixed(0)}</div>
                                    </div>
                                    {(() => {
                                        const approved = Array.isArray(refunds) ? refunds.filter(r => r.status === 'approved') : [];
                                        const refundedAmt = approved.reduce((s, r) => s + Number(r.amountRequested || r.order?.subtotal || 0), 0);
                                        const rate = A2.totalOrders ? (approved.length / A2.totalOrders) * 100 : 0;
                                        return (
                                            <>
                                                <div className="p-4 border border-white/20 rounded-xl bg-white/80 shadow-sm">
                                                    <div className="text-sm text-gray-600">Total Refunded</div>
                                                    <div className="text-2xl font-bold text-red-600">₹ {Number(refundedAmt).toLocaleString('en-IN')}</div>
                                                </div>
                                                <div className="p-4 border border-white/20 rounded-xl bg-white/80 shadow-sm">
                                                    <div className="text-sm text-gray-600">Refund Rate</div>
                                                    <div className="text-2xl font-bold">{rate.toFixed(1)}%</div>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 border border-white/20 rounded-xl bg-white/80 shadow-sm">
                                        <div className="font-semibold mb-2">Most Sold Products</div>
                                        <div className="divide-y">
                                            {A2.mostSold.map((p, idx) => (
                                                <div key={idx} className="py-2 flex justify-between items-center">
                                                    <div className="truncate pr-2">{p.name}</div>
                                                    <div className="text-sm text-gray-700">Qty: {p.qty} · ₹ {Number(p.revenue).toLocaleString('en-IN')}</div>
                                                </div>
                                            ))}
                                            {A2.mostSold.length === 0 && (
                                                <div className="text-sm text-gray-500">No data</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-4 border border-white/20 rounded-xl bg-white/80 shadow-sm">
                                        <div className="flex items-start justify-between">
                                            <div className="font-semibold mb-2">Revenue by Payment Method</div>
                                            <button
                                                onClick={() => {
                                                    const rows = [["Method", "Revenue"]].concat(Object.entries(A2.byPayment).map(([k, v]) => [k, Number(v)]));
                                                    downloadCSV('payment_breakdown.csv', rows);
                                                }}
                                                className="text-xs px-2 py-1 border rounded bg-white hover:bg-gray-100"
                                            >Export CSV</button>
                                        </div>
                                        <div className="flex gap-4 items-center">
                                            {(() => {
                                                const entries = Object.entries(A2.byPayment);
                                                const total = entries.reduce((s, [, v]) => s + Number(v || 0), 0) || 1;
                                                const colors = ['#2563eb', '#16a34a', '#f59e0b', '#ef4444', '#7c3aed', '#0ea5e9'];
                                                let acc = 0;
                                                const segments = entries.map(([k, v], i) => {
                                                    const val = Math.max(0, Number(v || 0));
                                                    const pct = (val / total) * 100;
                                                    const from = acc; const to = acc + pct; acc = to;
                                                    const color = colors[i % colors.length];
                                                    return `${color} ${from}% ${to}%`;
                                                }).join(', ');
                                                return (
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-28 h-28 rounded-full" style={{ background: `conic-gradient(${segments})` }} />
                                                        <div className="space-y-1 text-sm">
                                                            {entries.map(([k, v], i) => (
                                                                <div key={k} className="flex items-center gap-2">
                                                                    <span className="inline-block w-3 h-3 rounded-sm" style={{ background: colors[i % colors.length] }} />
                                                                    <span className="capitalize">{k}</span>
                                                                    <span className="text-gray-600">₹ {Number(v).toLocaleString('en-IN')}</span>
                                                                </div>
                                                            ))}
                                                            {entries.length === 0 && <div className="text-sm text-gray-500">No data</div>}
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                        <div className="mt-3 space-y-2">
                                            {Object.entries(A2.byPayment).map(([k, v]) => (
                                                <div key={k}>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="capitalize">{k}</span>
                                                        <span>₹ {Number(v).toLocaleString('en-IN')}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 h-2 rounded">
                                                        <div className="bg-blue-600 h-2 rounded" style={{ width: `${Math.min(100, (Number(v) / Math.max(1, A2.totalRevenue)) * 100)}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                            {Object.keys(A2.byPayment).length === 0 && (
                                                <div className="text-sm text-gray-500">No data</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
{/* 
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {(() => {
                                        const list = Array.isArray(orders) ? orders : [];
                                        const total = list.length || 0;
                                        const cancelled = list.reduce((n, o) => n + (o.status === 'cancelled' ? 1 : 0), 0);
                                        const paid = list.reduce((n, o) => n + (o.paid ? 1 : 0), 0);
                                        const cancellationRate = total ? (cancelled / total) * 100 : 0;
                                        const paidRate = total ? (paid / total) * 100 : 0;
                                        return (
                                            <>
                                                <div className="p-4 border border-white/20 rounded-xl bg-white/80 shadow-sm">
                                                    <div className="text-sm text-gray-600">Cancellation Rate</div>
                                                    <div className="text-2xl font-bold">{cancellationRate.toFixed(1)}%</div>
                                                    <div className="w-full bg-gray-200 h-2 rounded mt-2">
                                                        <div className="bg-red-500 h-2 rounded" style={{ width: `${Math.min(100, cancellationRate)}%` }} />
                                                    </div>
                                                </div>
                                                <div className="p-4 border border-white/20 rounded-xl bg-white/80 shadow-sm">
                                                    <div className="text-sm text-gray-600">Paid Orders Rate</div>
                                                    <div className="text-2xl font-bold">{paidRate.toFixed(1)}%</div>
                                                    <div className="w-full bg-gray-200 h-2 rounded mt-2">
                                                        <div className="bg-green-600 h-2 rounded" style={{ width: `${Math.min(100, paidRate)}%` }} />
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>

                                <div className="mt-4 p-4 border border-white/20 rounded-xl bg-white/80 shadow-sm">
                                    <div className="font-semibold mb-2">Order Status Breakdown</div>
                                    {(() => {
                                        // Prefer server-provided byStatus (already filtered by selected range)
                                        const serverCounts = analyticsData && analyticsData.byStatus ? analyticsData.byStatus : null;
                                        let counts = {};
                                        let total = 0;
                                        if (serverCounts) {
                                            counts = serverCounts;
                                            total = Object.values(serverCounts).reduce((s, v) => s + Number(v || 0), 0);
                                        } else {
                                            const list = Array.isArray(orders) ? orders : [];
                                            // apply the same date filter
                                            const listF = list.filter(o => {
                                                if (!o.createdAt) return range === 'all';
                                                const d = new Date(o.createdAt);
                                                let s = null, e = new Date();
                                                if (range === '7d') { s = new Date(); s.setDate(e.getDate() - 6); }
                                                else if (range === '30d') { s = new Date(); s.setDate(e.getDate() - 29); }
                                                else if (range === '90d') { s = new Date(); s.setDate(e.getDate() - 89); }
                                                else if (range === 'custom') { s = startDate ? new Date(startDate + 'T00:00:00') : null; e = endDate ? new Date(endDate + 'T23:59:59') : e; }
                                                return !s || (d >= s && d <= e);
                                            });
                                            counts = listF.reduce((acc, o) => { const s = o.status || 'unknown'; acc[s] = (acc[s] || 0) + 1; return acc; }, {});
                                            total = listF.length || 0;
                                        }
                                        const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
                                        // donut
                                        const colors = ['#16a34a', '#2563eb', '#7c3aed', '#f59e0b', '#ef4444', '#0ea5e9'];
                                        let accPct = 0;
                                        const segs = entries.map(([status, count], i) => {
                                            const pct = total ? (count / total) * 100 : 0;
                                            const from = accPct; const to = accPct + pct; accPct = to;
                                            return `${colors[i % colors.length]} ${from}% ${to}%`;
                                        }).join(', ');
                                        return (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-28 h-28 rounded-full" style={{ background: `conic-gradient(${segs})` }} />
                                                    <div className="space-y-1 text-sm">
                                                        {entries.map(([status, count], i) => (
                                                            <div key={status} className="flex items-center gap-2">
                                                                <span className="inline-block w-3 h-3 rounded-sm" style={{ background: colors[i % colors.length] }} />
                                                                <span className="capitalize">{status}</span>
                                                                <span className="text-gray-600">{count} ({total ? ((count / total) * 100).toFixed(0) : 0}%)</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const rows = [["Status", "Count"]].concat(entries.map(([k, v]) => [k, Number(v)]));
                                                        downloadCSV('status_breakdown.csv', rows);
                                                    }}
                                                    className="text-xs px-2 py-1 rounded border bg-white hover:bg-gray-100"
                                                >Export CSV</button>
                                                {entries.map(([status, count]) => (
                                                    <div key={status}>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="capitalize">{status}</span>
                                                            <span>{count} ({total ? ((count / total) * 100).toFixed(0) : 0}%)</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 h-2 rounded">
                                                            <div className="bg-purple-600 h-2 rounded" style={{ width: `${total ? (count / total) * 100 : 0}%` }} />
                                                        </div>
                                                    </div>
                                                ))}
                                                {entries.length === 0 && (
                                                    <div className="text-sm text-gray-500">No data</div>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </div>
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {(() => {
                                        const listAll = Array.isArray(orders) ? orders : [];
                                        const firstByEmail = {};
                                        listAll.forEach(o => {
                                            const email = o.customer?.email || o.user?.email || null;
                                            const name = o.customer?.name || email || 'unknown';
                                            if (!email || email === 'unknown') return;
                                            const d = o.createdAt ? new Date(o.createdAt) : null;
                                            if (!firstByEmail[email] || d < firstByEmail[email]) firstByEmail[email] = d;
                                        });
                                        const isSameDay = (a, b) => a && b && (new Date(a)).getTime() === (new Date(b)).getTime();
                                        let newCount = 0, returningCount = 0, newRev = 0, returningRev = 0;
                                        nonCancelled.forEach(o => {
                                            const email = o.customer?.email || o.user?.email || null;
                                            if (!email || !o.createdAt) return;
                                            const d = new Date(o.createdAt);
                                            if (isSameDay(firstByEmail[email], d)) { newCount += 1; newRev += (o.subtotal || 0); }
                                            else { returningCount += 1; returningRev += (o.subtotal || 0); }
                                        });
                                        const totalC = newCount + returningCount || 1;
                                        return (
                                            <div className="p-4 border border-white/20 rounded-xl bg-white/80 shadow-sm">
                                                <div className="font-semibold mb-2">New vs Returning Customers</div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <div className="text-sm text-gray-600">New Customers</div>
                                                        <div className="text-2xl font-bold">{newCount}</div>
                                                        <div className="text-xs text-gray-600">₹ {Number(newRev).toLocaleString('en-IN')} • {(newCount ? (newCount / totalC) * 100 : 0).toFixed(0)}%</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-600">Returning Customers</div>
                                                        <div className="text-2xl font-bold">{returningCount}</div>
                                                        <div className="text-xs text-gray-600">₹ {Number(returningRev).toLocaleString('en-IN')} • {(returningCount ? (returningCount / totalC) * 100 : 0).toFixed(0)}%</div>
                                                    </div>
                                                </div>
                                                <div className="mt-3 w-full bg-gray-200 h-2 rounded">
                                                    <div className="h-2 rounded bg-blue-600" style={{ width: `${Math.min(100, (newCount / totalC) * 100)}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {(() => {
                                        const listAll = Array.isArray(orders) ? orders : [];
                                        const now2 = new Date();
                                        const byCust = {};
                                        listAll.forEach(o => {
                                            const email = o.customer?.email || o.user?.email || 'unknown';
                                            const name = o.customer?.name || email;
                                            if (!email || email === 'unknown') return;
                                            const d = o.createdAt ? new Date(o.createdAt) : null;
                                            if (!byCust[email]) byCust[email] = { name, email, freq: 0, monetary: 0, last: null };
                                            byCust[email].freq += 1;
                                            byCust[email].monetary += (o.subtotal || 0);
                                            if (d && (!byCust[email].last || d > byCust[email].last)) byCust[email].last = d;
                                        });
                                        const scoreRecency = (days) => days <= 7 ? 5 : days <= 30 ? 4 : days <= 90 ? 3 : days <= 180 ? 2 : 1;
                                        const scoreFreq = (n) => n >= 10 ? 5 : n >= 5 ? 4 : n >= 3 ? 3 : n >= 2 ? 2 : 1;
                                        const scoreMon = (amt) => amt >= 50000 ? 5 : amt >= 20000 ? 4 : amt >= 10000 ? 3 : amt >= 5000 ? 2 : 1;
                                        const rows = Object.values(byCust).map(c => {
                                            const days = c.last ? Math.floor((now2 - c.last) / (1000 * 60 * 60 * 24)) : 9999;
                                            const r = scoreRecency(days), f = scoreFreq(c.freq), m = scoreMon(c.monetary);
                                            return { ...c, recencyDays: days, rfm: r + f + m, r, f, m };
                                        }).sort((a, b) => b.rfm - a.rfm || b.monetary - a.monetary).slice(0, 5);
                                        return (
                                            <div className="p-4 border border-white/20 rounded-xl bg-white/80 shadow-sm">
                                                <div className="font-semibold mb-2">RFM Summary (Top 5)</div>
                                                <div className="divide-y">
                                                    {rows.map((c, idx) => (
                                                        <div key={idx} className="py-2 flex justify-between items-center">
                                                            <div className="truncate pr-2">
                                                                <div className="font-semibold">{c.name}</div>
                                                                <div className="text-xs text-gray-500">{c.email}</div>
                                                            </div>
                                                            <div className="text-right text-xs text-gray-700">
                                                                <div>RFM: {c.rfm} (R{c.r} F{c.f} M{c.m})</div>
                                                                <div>Orders: {c.freq} · ₹ {Number(c.monetary).toLocaleString('en-IN')}</div>
                                                                <div>Recency: {c.recencyDays}d</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {rows.length === 0 && (
                                                        <div className="text-sm text-gray-500 py-2">No data</div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>

                                <div className="mt-4 p-4 border border-white/20 rounded-xl bg-white/80 shadow-sm">
                                    <div className="font-semibold mb-2">Top Customers</div>
                                    {(() => {
                                        const list = Array.isArray(orders) ? orders : [];
                                        const map = {};
                                        list.forEach(o => {
                                            const email = o.customer?.email || o.user?.email || 'unknown';
                                            const name = o.customer?.name || email;
                                            if (!email || email === 'unknown') return;
                                            const d = o.createdAt ? new Date(o.createdAt) : null;
                                            if (!map[email]) map[email] = { name, email, orders: 0, revenue: 0 };
                                            map[email].orders += 1;
                                            map[email].revenue += (o.subtotal || 0);
                                        });
                                        const top = Object.values(map).filter(c => c.email !== 'unknown').sort((a, b) => b.revenue - a.revenue).slice(0, 5);
                                        return (
                                            <div className="divide-y">
                                                <div className="flex items-center justify-end mb-2">
                                                    <button
                                                        onClick={() => {
                                                            const rows = [["Name", "Email", "Orders", "Revenue"]].concat(top.map(c => [c.name, c.email, c.orders, c.revenue]));
                                                            downloadCSV('top_customers.csv', rows);
                                                        }}
                                                        className="text-xs px-2 py-1 border rounded bg-white hover:bg-gray-100"
                                                    >Export CSV</button>
                                                </div>
                                                {top.map((c, idx) => (
                                                    <div key={idx} className="py-2 flex justify-between items-center">
                                                        <div className="truncate pr-2">
                                                            <div className="font-semibold">{c.name}</div>
                                                            <div className="text-xs text-gray-500">{c.email}</div>
                                                        </div>
                                                        <div className="text-right text-sm text-gray-700">
                                                            <div>Orders: {c.orders}</div>
                                                            <div>₹ {Number(c.revenue).toLocaleString('en-IN')}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {top.length === 0 && (
                                                    <div className="text-sm text-gray-500 py-2">No data</div>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </div>

                                <div className="mt-4 p-4 border border-white/20 rounded-xl bg-white/80 shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="font-semibold">Trend (Last 6 months)</div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setTrendMetric('revenue')} className={`text-xs px-2 py-1 rounded border ${trendMetric === 'revenue' ? 'bg-blue-600 text-black' : 'bg-white'}`}>Revenue</button>
                                            <button onClick={() => setTrendMetric('orders')} className={`text-xs px-2 py-1 rounded border ${trendMetric === 'orders' ? 'bg-blue-600 text-black' : 'bg-white'}`}>Orders</button>
                                            <button
                                                onClick={() => {
                                                    const months = A2.trend.map(t => t.month);
                                                    // Prefer server-provided ordersTrend
                                                    const rows = trendMetric === 'revenue'
                                                        ? [["Month", "Revenue"], ...A2.trend.map(t => [t.month, Number(t.revenue || 0)])]
                                                        : (Array.isArray(A2.ordersTrend) && A2.ordersTrend.length > 0
                                                            ? [["Month", "Orders"], ...A2.ordersTrend.map(o => [o.period, Number(o.orders || 0)])]
                                                            : (() => {
                                                                const countsMap = {};
                                                                nonCancelled.forEach(o => {
                                                                    const d = o.createdAt ? new Date(o.createdAt) : null; if (!d) return;
                                                                    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                                                                    countsMap[k] = (countsMap[k] || 0) + 1;
                                                                });
                                                                return [["Month", "Orders"], ...months.map(m => [m, Number(countsMap[m] || 0)])];
                                                            })()
                                                        );
                                                    downloadCSV(trendMetric === 'revenue' ? 'monthly_revenue.csv' : 'monthly_orders.csv', rows);
                                                }}
                                                className="text-xs px-2 py-1 rounded border bg-white hover:bg-gray-100"
                                            >Export CSV</button>
                                        </div>
                                    </div>
                                    <div className="w-full" style={{ minHeight: 180 }}>
                                        {(() => {
                                            const months = A2.trend.map(t => t.month);
                                            const series = trendMetric === 'revenue'
                                                ? A2.trend.map(t => ({ key: t.month, label: new Date(`${t.month}-01`).toLocaleString('en-US', { month: 'short' }), value: Number(t.revenue || 0) }))
                                                : (Array.isArray(A2.ordersTrend) && A2.ordersTrend.length > 0
                                                    ? A2.ordersTrend.map(o => ({ key: o.period, label: new Date(`${o.period}-01`).toLocaleString('en-US', { month: 'short' }), value: Number(o.orders || 0) }))
                                                    : (() => {
                                                        const countsMap = {};
                                                        nonCancelled.forEach(o => {
                                                            const d = o.createdAt ? new Date(o.createdAt) : null; if (!d) return;
                                                            const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                                                            countsMap[k] = (countsMap[k] || 0) + 1;
                                                        });
                                                        return months.map(m => ({ key: m, label: new Date(`${m}-01`).toLocaleString('en-US', { month: 'short' }), value: Number(countsMap[m] || 0) }));
                                                    })()
                                                );
                                            if (series.length === 0) return <div className="text-sm text-gray-500">No data</div>;
                                            const padding = { l: 24, r: 12, t: 10, b: 24 };
                                            const W = 420, H = 140;
                                            const maxValRaw = Math.max(0, ...series.map(s => s.value));
                                            const maxVal = Math.max(1, maxValRaw);
                                            const stepX = series.length > 1 ? (W - padding.l - padding.r) / (series.length - 1) : 0;
                                            const toX = (i) => padding.l + i * stepX;
                                            const toY = (v) => padding.t + (H - padding.t - padding.b) * (1 - (v / maxVal));
                                            const points = series.map((s, i) => `${toX(i)},${toY(s.value)}`).join(' ');
                                            const stroke = trendMetric === 'revenue' ? '#10b981' : '#9333ea';
                                            const fill = trendMetric === 'revenue' ? 'rgba(16,185,129,0.15)' : 'rgba(147,51,234,0.15)';
                                            const baseY = H - padding.b;
                                            const areaPath = `M ${toX(0)} ${toY(series[0].value)} L ${series.map((s, i) => `${toX(i)} ${toY(s.value)}`).join(' L ')} L ${toX(series.length - 1)} ${baseY} L ${toX(0)} ${baseY} Z`;
                                            return (
                                                <div className="w-full">
                                                    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-full">
                                                        <defs>
                                                            <linearGradient id="trend6m" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="0%" stopColor={fill} />
                                                                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                                                            </linearGradient>
                                                        </defs>
                                                        {maxValRaw === 0 ? (
                                                            <>
                                                                <line x1={padding.l} y1={baseY} x2={W - padding.r} y2={baseY} stroke="#9ca3af" strokeDasharray="4 3" />
                                                                {series.map((s, i) => (
                                                                    <g key={s.key}>
                                                                        <circle cx={toX(i)} cy={baseY} r="4" fill={stroke} />
                                                                        <text x={toX(i)} y={H - 6} fontSize="9" textAnchor="middle" fill="#374151">{s.label}</text>
                                                                    </g>
                                                                ))}
                                                                <text x={W / 2} y={padding.t + 12} fontSize="10" textAnchor="middle" fill="#6b7280">No {trendMetric === 'revenue' ? 'revenue' : 'orders'} in selected range</text>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <path d={areaPath} fill="url(#trend6m)" />
                                                                <polyline points={points} fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                                                                {series.map((s, i) => (
                                                                    <g key={s.key}>
                                                                        <circle cx={toX(i)} cy={toY(s.value)} r="3" fill={stroke} />
                                                                        <text x={toX(i)} y={H - 6} fontSize="9" textAnchor="middle" fill="#374151">{s.label}</text>
                                                                    </g>
                                                                ))}
                                                            </>
                                                        )}
                                                    </svg>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>

                                <div className="mt-4 p-4 border rounded bg-white/80">
                                    <div className="font-semibold mb-2">Revenue Trend (Last 30 days)</div>
                                    {(() => {
                                        const list = Array.isArray(orders) ? orders : [];
                                        const now = new Date();
                                        const start = new Date();
                                        start.setDate(now.getDate() - 29);
                                        const byDay = {};
                                        const byDayCount = {};
                                        list.forEach(o => {
                                            if (!o.createdAt) return;
                                            const d = new Date(o.createdAt);
                                            if (d < start || d > now) return;
                                            const key = d.toISOString().slice(0, 10);
                                            byDay[key] = (byDay[key] || 0) + (o.subtotal || 0);
                                            byDayCount[key] = (byDayCount[key] || 0) + 1;
                                        });
                                        const days = Array.from({ length: 30 }).map((_, i) => {
                                            const d = new Date(start);
                                            d.setDate(start.getDate() + i);
                                            const key = d.toISOString().slice(0, 10);
                                            return { key, label: key.slice(5), revenue: byDay[key] || 0, orders: byDayCount[key] || 0 };
                                        });
                                        const values = days.map(d => trendMetric === 'revenue' ? d.revenue : d.orders);
                                        const max = Math.max(1, ...values);
                                        const padding = { l: 28, r: 8, t: 10, b: 18 };
                                        const W = 900, H = 140; // wide for 30 days; container scrolls
                                        const stepX = (W - padding.l - padding.r) / Math.max(1, days.length - 1);
                                        const toX = (i) => padding.l + i * stepX;
                                        const toY = (v) => padding.t + (H - padding.t - padding.b) * (1 - (v / max));
                                        const valueOf = (d) => (trendMetric === 'revenue' ? d.revenue : d.orders);
                                        const pts = days.map((d, i) => `${toX(i)},${toY(valueOf(d))}`).join(' ');
                                        // 7-day moving average
                                        const ma = values.map((_, i) => {
                                            const start = Math.max(0, i - 6);
                                            const slice = values.slice(start, i + 1);
                                            const sum = slice.reduce((s, v) => s + v, 0);
                                            return sum / slice.length;
                                        });
                                        const maPts = ma.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');
                                        const stroke = '#2563eb';
                                        const fill = 'rgba(37,99,235,0.15)';
                                        const areaPath = `M ${toX(0)} ${toY(valueOf(days[0]))} L ${days.map((d, i) => `${toX(i)} ${toY(valueOf(d))}`).join(' L ')} L ${toX(days.length - 1)} ${H - padding.b} L ${toX(0)} ${H - padding.b} Z`;
                                        return (
                                            <div className="w-full overflow-x-auto" style={{ minHeight: 160, background: 'repeating-linear-gradient(to top, rgba(0,0,0,0.06), rgba(0,0,0,0.06) 1px, transparent 1px, transparent 25px)' }}>
                                                <svg viewBox={`0 0 ${W} ${H}`} style={{ minWidth: '600px' }}>
                                                    <defs>
                                                        <linearGradient id="trend30d" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor={fill} />
                                                            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                                                        </linearGradient>
                                                    </defs>
                                                    <path d={areaPath} fill="url(#trend30d)" />
                                                    <polyline points={pts} fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                                                    <polyline points={maPts} fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3" strokeLinejoin="round" strokeLinecap="round" />
                                                    {days.map((d, i) => (
                                                        <g key={d.key}>
                                                            <circle cx={toX(i)} cy={toY(valueOf(d))} r="2.5" fill={stroke} />
                                                            <title>{`${new Date(d.key).toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' })}: ${trendMetric === 'revenue' ? `₹ ${Number(d.revenue || 0).toLocaleString('en-IN')}` : `${d.orders} orders`}`}</title>
                                                        </g>
                                                    ))}
                                                </svg>
                                            </div>
                                        );
                                    })()}
                                </div> */}
                            </>
                        );
                    })()}
                </div>
            )}

        </div>
    );
}
