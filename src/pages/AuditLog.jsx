import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, History, CalendarCheck, Users, Info, Download } from "lucide-react";

// Impor komponen UI
import Modal from "../components/Modal";
import Notification, { useNotification } from "../components/Notification";

// Komponen Kartu Statistik
const StatCard = ({ icon, title, value, loading }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-6 border-l-4 border-green-500">
    {loading ? <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse" /> : <div className="p-4 rounded-full bg-green-500/10 text-green-600">{icon}</div>}
    <div>
      {loading ? (<><div className="w-24 h-6 mb-2 bg-gray-200 rounded animate-pulse" /><div className="w-16 h-4 bg-gray-200 rounded animate-pulse" /></>) : (<><p className="text-2xl font-bold text-gray-800">{value}</p><p className="text-sm font-medium text-gray-500">{title}</p></>)}
    </div>
  </div>
);

const AuditLog = () => {
  const authToken = localStorage.getItem("adminToken");
  const { notification, showNotification, dismissNotification } = useNotification();

  // State
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState({ stats: true, table: true });
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, per_page: 15, total: 0 });
  const [filters, setFilters] = useState({ search: '', action: 'all', module: 'all' });
  const [selectedLog, setSelectedLog] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const axiosHeaders = useMemo(() => ({ headers: { Authorization: `Bearer ${authToken}` } }), [authToken]);

  // Fetch Statistik
  useEffect(() => {
    if (!authToken) return;
    axios.get('http://localhost:8000/api/audit-logs/statistics', axiosHeaders)
      .then(res => setStats(res.data.data))
      .catch(() => showNotification({ title: 'Error', message: 'Gagal memuat statistik log.', type: 'error' }))
      .finally(() => setLoading(prev => ({ ...prev, stats: false })));
  }, [authToken]);

  // Fetch Logs berdasarkan filter dan paginasi
  useEffect(() => {
    if (!authToken) return;
    setLoading(prev => ({ ...prev, table: true }));
    const params = new URLSearchParams({
      page: pagination.current_page,
      per_page: pagination.per_page,
      ...filters
    }).toString();

    axios.get(`http://localhost:8000/api/audit-logs?${params}`, axiosHeaders)
      .then(res => {
        setLogs(res.data.data.data);
        setPagination({
          current_page: res.data.data.current_page,
          last_page: res.data.data.last_page,
          per_page: res.data.data.per_page,
          total: res.data.data.total,
        });
      })
      .catch(() => showNotification({ title: 'Error', message: 'Gagal memuat data log.', type: 'error' }))
      .finally(() => setLoading(prev => ({ ...prev, table: false })));
  }, [authToken, filters, pagination.current_page, pagination.per_page]);

  // Handler
  const handleFilterChange = (e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleViewDetail = (log) => { setSelectedLog(log); setIsDetailModalOpen(true); };
  const handlePageChange = (newPage) => setPagination(prev => ({...prev, current_page: newPage}));

  // Fungsi utilitas
  const formatDate = (dateString) => new Date(dateString).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' });
  const getActionBadge = (action) => {
    const colors = { create: 'bg-green-100 text-green-800', update: 'bg-blue-100 text-blue-800', delete: 'bg-red-100 text-red-800', login: 'bg-indigo-100 text-indigo-800', logout: 'bg-gray-100 text-gray-800' };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[action] || 'bg-gray-100'}`}>{action}</span>;
  };

  // Animasi
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
    <>
      <Notification notification={notification} onDismiss={dismissNotification} />
      <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard icon={<History size={28} />} title="Total Log Tercatat" value={stats.total_logs || 0} loading={loading.stats} />
          <StatCard icon={<CalendarCheck size={28} />} title="Aktivitas Hari Ini" value={stats.today_logs || 0} loading={loading.stats} />
          <StatCard icon={<Users size={28} />} title="Admin Aktif" value={stats.unique_users || 0} loading={loading.stats} />
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-gray-800">Riwayat Aktivitas</h2>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-52"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" name="search" placeholder="Cari..." onChange={handleFilterChange} className="pl-10 pr-4 py-2 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none" /></div>
              <select name="action" onChange={handleFilterChange} className="border border-gray-300 px-3 py-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none"><option value="all">Semua Aksi</option><option value="create">Create</option><option value="update">Update</option><option value="delete">Delete</option><option value="login">Login</option></select>
              <select name="module" onChange={handleFilterChange} className="border border-gray-300 px-3 py-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none"><option value="all">Semua Modul</option><option value="products">Produk</option><option value="orders">Pesanan</option><option value="users">User</option><option value="auth">Auth</option></select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {loading.table ? <div>Memuat...</div> : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr className="text-left text-gray-500 uppercase border-b border-gray-200"><th className="py-3 px-4">Admin</th><th className="py-3 px-4">Aksi</th><th className="py-3 px-4">Modul</th><th className="py-3 px-4">Deskripsi</th><th className="py-3 px-4">Waktu</th><th className="py-3 px-4">Detail</th></tr></thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log.id} className="hover:bg-gray-50 border-b border-gray-200">
                      <td className="py-3 px-4 font-medium text-gray-800">{log.user_name}</td>
                      <td className="py-3 px-4">{getActionBadge(log.action)}</td>
                      <td className="py-3 px-4 capitalize">{log.module}</td>
                      <td className="py-3 px-4 text-gray-600">{log.description}</td>
                      <td className="py-3 px-4 text-gray-500">{formatDate(log.created_at)}</td>
                      <td className="py-3 px-4"><button onClick={() => handleViewDetail(log)} className="bg-gray-100 text-gray-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-200 transition flex items-center"><Info className="w-4 h-4 mr-1.5" /> Lihat</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="flex justify-between items-center p-2 text-sm text-gray-600 border-t mt-4">
             <span>Menampilkan {logs.length} dari {pagination.total} data</span>
             <div className="flex items-center gap-2">
                <button onClick={() => handlePageChange(pagination.current_page - 1)} disabled={pagination.current_page <= 1} className="px-2 py-1 border rounded hover:bg-gray-100 disabled:text-gray-400">Sebelumnya</button>
                <span>Halaman {pagination.current_page} dari {pagination.last_page}</span>
                <button onClick={() => handlePageChange(pagination.current_page + 1)} disabled={pagination.current_page >= pagination.last_page} className="px-2 py-1 border rounded hover:bg-gray-100 disabled:text-gray-400">Berikutnya</button>
             </div>
          </div>
        </motion.div>
      </motion.div>

      {selectedLog && (
        <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Detail Log Aktivitas">
          <div className="space-y-3 text-sm">
            <p><span className="font-semibold w-28 inline-block">Admin:</span> {selectedLog.user_name}</p>
            <p><span className="font-semibold w-28 inline-block">Aksi:</span> {selectedLog.action}</p>
            <p><span className="font-semibold w-28 inline-block">Modul:</span> {selectedLog.module}</p>
            <p><span className="font-semibold w-28 inline-block">Deskripsi:</span> {selectedLog.description}</p>
            <p><span className="font-semibold w-28 inline-block">IP Address:</span> {selectedLog.ip_address}</p>
            <p><span className="font-semibold w-28 inline-block">Waktu:</span> {formatDate(selectedLog.created_at)}</p>
            
            {selectedLog.old_values && (
              <div><span className="font-semibold w-28 inline-block">Data Lama:</span><pre className="bg-gray-100 p-2 rounded mt-1 text-xs"><code>{JSON.stringify(selectedLog.old_values, null, 2)}</code></pre></div>
            )}
            {selectedLog.new_values && (
              <div><span className="font-semibold w-28 inline-block">Data Baru:</span><pre className="bg-green-50 p-2 rounded mt-1 text-xs"><code>{JSON.stringify(selectedLog.new_values, null, 2)}</code></pre></div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default AuditLog;
