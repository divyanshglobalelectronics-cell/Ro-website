import AdminLogs from '../components/admin/AdminLogs.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminLogsPage() {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6">Loading...</div>;
  if (!user || !user.isAdmin) return <div className="p-6">Unauthorized: Admins only</div>;

  return (
    <div className="p-6 bg-gradient-to-b from-[#484b8b] to-[#1b083a] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-white mb-4">Admin — Audit Logs</h1>
        <div className="bg-white p-4 rounded-lg">
          <AdminLogs />
        </div>
      </div>
    </div>
  );
}
