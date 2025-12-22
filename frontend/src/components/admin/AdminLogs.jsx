import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { apiGet } from '../../api/client.js';
import AuditDetailsDiff from './AuditDetailsDiff.jsx';

export default function AdminLogs() {
  const { token } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ action: '', resourceType: '', userEmail: '', from: '', to: '', q: '' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [total, setTotal] = useState(0);
  const [detailModal, setDetailModal] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => { fetchLogs(); }, [page, pageSize]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => { fetchLogs(); }, 10000);
    return () => clearInterval(id);
  }, [autoRefresh, page, pageSize, filters]);

  async function fetchLogs() {
    setLoading(true);
    setError('');
    try {
      const qs = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) qs.set(k, v); });
      qs.set('limit', String(pageSize));
      qs.set('skip', String((page - 1) * pageSize));
      const url = '/api/admin/logs' + (qs.toString() ? ('?' + qs.toString()) : '');
      const data = await apiGet(url, token);
      if (data && Array.isArray(data.logs)) {
        setLogs(data.logs);
        setTotal(Number(data.count) || 0);
      } else if (Array.isArray(data)) {
        setLogs(data);
        setTotal(data.length || 0);
      } else {
        setLogs([]);
        setTotal(0);
      }
    } catch (e) {
      setError(e.message || 'Failed to load logs');
    } finally { setLoading(false); }
  }

  async function handleExportCSV() {
    try {
      const qs = new URLSearchParams({ ...(filters || {}), export: 'csv' });
      // include pagination in export if desired
      const res = await fetch(`/api/admin/logs?${qs.toString()}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e.message || 'Export failed');
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Audit Logs</h2>
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="px-3 py-1 bg-green-600 text-white rounded">Export CSV</button>
          <button onClick={fetchLogs} className="px-3 py-1 border rounded">Apply</button>
          <label className="flex items-center gap-1 text-sm ml-2">
            <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
            <span>Auto-refresh</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-3">
        <select className="border p-2 rounded" value={filters.action} onChange={(e) => setFilters(f => ({ ...f, action: e.target.value }))}>
          <option value="">Any action</option>
          <option value="create_product">create_product</option>
          <option value="update_product">update_product</option>
          <option value="delete_product">delete_product</option>
          <option value="update_user">update_user</option>
          <option value="delete_user">delete_user</option>
          <option value="update_order">update_order</option>
          <option value="user_registered">user_registered</option>
          <option value="login_success">login_success</option>
          <option value="login_failed">login_failed</option>
        </select>
        <select className="border p-2 rounded" value={filters.resourceType} onChange={(e) => setFilters(f => ({ ...f, resourceType: e.target.value }))}>
          <option value="">Any resource</option>
          <option value="product">product</option>
          <option value="user">user</option>
          <option value="order">order</option>
          <option value="auth">auth</option>
        </select>
        <input className="border p-2 rounded col-span-2" placeholder="Admin email" value={filters.userEmail} onChange={(e) => setFilters(f => ({ ...f, userEmail: e.target.value }))} />
        <input className="border p-2 rounded col-span-2 md:col-span-2" placeholder="Keyword (action, resource, details, email, id)" value={filters.q} onChange={(e) => setFilters(f => ({ ...f, q: e.target.value }))} />
        <input type="date" className="border p-2 rounded" value={filters.from} onChange={(e) => setFilters(f => ({ ...f, from: e.target.value }))} />
        <input type="date" className="border p-2 rounded" value={filters.to} onChange={(e) => setFilters(f => ({ ...f, to: e.target.value }))} />
      </div>

      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <div className="overflow-auto">
            <div className="mb-2 text-sm text-gray-600">Showing {(page-1)*pageSize + 1} - {Math.min(page*pageSize, total)} of {total} logs</div>
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Admin</th>
                <th className="p-2 text-left">Action</th>
                <th className="p-2 text-left">Resource</th>
                <th className="p-2 text-left">Details</th>
                <th className="p-2 text-left">IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l._id} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2">{new Date(l.createdAt).toLocaleString()}</td>
                  <td className="p-2">{l.userEmail || l.userName || 'system'}</td>
                  <td className="p-2">{l.action}</td>
                  <td className="p-2">{l.resourceType} {l.resourceId ? `(${l.resourceId})` : ''}</td>
                    <td className="p-2 truncate max-w-md">
                      <div className="flex items-center gap-2">
                        <div className="truncate max-w-sm">{typeof l.details === 'string' ? l.details : JSON.stringify(l.details)}</div>
                        <button onClick={() => setDetailModal(l)} className="px-2 py-1 border rounded text-xs">Inspect</button>
                        <button onClick={() => { navigator.clipboard?.writeText(JSON.stringify(l.details)); }} className="px-2 py-1 border rounded text-xs">Copy</button>
                      </div>
                    </td>
                  <td className="p-2">{l.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="px-3 py-1 border rounded mr-2">Prev</button>
                <button onClick={() => setPage(p => (p*pageSize < total ? p+1 : p))} disabled={page*pageSize >= total} className="px-3 py-1 border rounded">Next</button>
              </div>
              <div className="text-sm text-gray-600">Page {page} • Page size: <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="ml-2 border rounded px-2 py-1">
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
        </div>
      )}
        {detailModal && (
          <div className="fixed inset-0 z-70 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white max-w-3xl w-11/12 p-4 rounded">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">Log details</div>
                <div className="flex gap-2">
                  <button onClick={() => { navigator.clipboard?.writeText(JSON.stringify(detailModal.details, null, 2)); }} className="px-2 py-1 border rounded text-sm">Copy</button>
                  <button onClick={() => setDetailModal(null)} className="px-2 py-1 border rounded text-sm">Close</button>
                </div>
              </div>
              <div className="max-h-96 overflow-auto">
                <AuditDetailsDiff details={detailModal.details} />
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
