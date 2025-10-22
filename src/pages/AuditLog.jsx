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

// --- KOMPONEN CARD UNTUK MOBILE ---
const LogCard = ({ log, index, onViewDetail }) => {
  const getActionBadge = (action) => {
    const colors = { 
      create: 'bg-green-100 text-green-800', 
      update: 'bg-blue-100 text-blue-800', 
      delete: 'bg-red-100 text-red-800', 
      login: 'bg-indigo-100 text-indigo-800', 
      logout: 'bg-gray-100 text-gray-800' 
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[action] || 'bg-gray-100'}`}>{action}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', { 
      dateStyle: 'long', 
      timeStyle: 'short' 
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">
            #{index + 1}
          </h3>
          <p className="text-xs text-gray-500 mt-1 flex items-center">
            <CalendarCheck className="w-3 h-3 mr-1" />
            {formatDate(log.created_at)}
          </p>
        </div>
        {getActionBadge(log.action)}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{log.user_name}</span>
        </div>
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600 capitalize">{log.module}</span>
        </div>
        <div className="text-gray-600 line-clamp-2">
          {log.description}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100">
        <button
          onClick={() => onViewDetail(log)}
          className="w-full bg-gray-100 text-gray-700 font-medium px-3 py-2 rounded-lg hover:bg-gray-200 transition flex items-center justify-center text-sm"
        >
          <Info className="w-4 h-4 mr-1.5" />
          Lihat Detail
        </button>
      </div>
    </div>
  );
};

const AuditLog = () => {
  const authToken = localStorage.getItem("adminToken");
  const { notification, showNotification, dismissNotification } = useNotification();

  // State
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState({ stats: true, table: true });
  const [error, setError] = useState(null); // TAMBAHKAN STATE ERROR
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, per_page: 15, total: 0 });
  const [filters, setFilters] = useState({ search: '', action: 'all', module: 'all' });
  const [selectedLog, setSelectedLog] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // State untuk pagination dan filter (mirip dengan orders)
  const [filterText, setFilterText] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [filterModule, setFilterModule] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const axiosHeaders = useMemo(() => ({ headers: { Authorization: `Bearer ${authToken}` } }), [authToken]);

  // Fungsi untuk menangani error, terutama 401 Unauthorized
  const handleError = (error, message) => {
    if (error.response && error.response.status === 401) {
      window.location.href = "/login";
    } else {
      setError(message); // SET ERROR STATE
      showNotification(message, 'error');
    }
  };

  // Fetch Statistik
  useEffect(() => {
    if (!authToken) return;
    axios.get('http://localhost:8000/api/audit-logs/statistics', axiosHeaders)
      .then(res => setStats(res.data.data))
      .catch((err) => handleError(err, 'Gagal memuat statistik log.'))
      .finally(() => setLoading(prev => ({ ...prev, stats: false })));
  }, [authToken]);

  // Fetch Logs
  useEffect(() => {
    if (!authToken) return;
    setLoading(prev => ({ ...prev, table: true }));
    setError(null); // RESET ERROR SEBELUM FETCH
    
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
      .catch((err) => handleError(err, 'Gagal memuat data log.'))
      .finally(() => setLoading(prev => ({ ...prev, table: false })));
  }, [authToken, filters, pagination.current_page, pagination.per_page]);

  // Handler untuk filter baru (mirip orders)
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handleViewDetail = (log) => { 
    setSelectedLog(log); 
    setIsDetailModalOpen(true); 
  };

  // Fungsi utilitas
  const formatDate = (dateString) => new Date(dateString).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' });
  
  const getActionBadge = (action) => {
    const colors = { 
      create: 'bg-green-100 text-green-800', 
      update: 'bg-blue-100 text-blue-800', 
      delete: 'bg-red-100 text-red-800', 
      login: 'bg-indigo-100 text-indigo-800', 
      logout: 'bg-gray-100 text-gray-800' 
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[action] || 'bg-gray-100'}`}>{action}</span>;
  };

  // Komponen Skeleton Loading untuk Tabel
  const LoadingTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm animate-pulse">
        <thead className="bg-gray-50">
          <tr className="text-left text-gray-500 uppercase border-b border-gray-200">
            <th className="py-3 px-4">NO</th>
            <th className="py-3 px-4">Admin</th>
            <th className="py-3 px-4">Aksi</th>
            <th className="py-3 px-4">Modul</th>
            <th className="py-3 px-4">Deskripsi</th>
            <th className="py-3 px-4">Waktu</th>
            <th className="py-3 px-4">Detail</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(rowsPerPage)].map((_, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-8"></div></td>
              <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
              <td className="py-3 px-4"><div className="h-6 bg-gray-200 rounded-full w-20"></div></td>
              <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
              <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
              <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
              <td className="py-3 px-4"><div className="h-8 w-20 bg-gray-200 rounded-lg"></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Komponen Skeleton Loading untuk Cards
  const LoadingCards = () => (
    <div className="space-y-4">
      {[...Array(rowsPerPage)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
          <div className="flex justify-between mb-3">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-32"></div>
            <div className="h-3 bg-gray-200 rounded w-28"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded-lg mt-3"></div>
        </div>
      ))}
    </div>
  );

  // Animasi
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  // Hitungan untuk pagination (mirip orders)
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedLogs = useMemo(() => logs.slice(startIndex, endIndex), [logs, startIndex, endIndex]);
  const totalPages = Math.ceil(logs.length / rowsPerPage);

  return (
    <>
      <Notification notification={notification} onDismiss={dismissNotification} />
      
      {/* Statistik Cards */}
      <motion.div className="space-y-6 mb-8" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard icon={<History size={28} />} title="Total Log Tercatat" value={stats.total_logs || 0} loading={loading.stats} />
          <StatCard icon={<CalendarCheck size={28} />} title="Aktivitas Hari Ini" value={stats.today_logs || 0} loading={loading.stats} />
          <StatCard icon={<Users size={28} />} title="Admin Aktif" value={stats.unique_users || 0} loading={loading.stats} />
        </motion.div>
      </motion.div>

      {/* Main Content Card (mirip orders) */}
      <motion.div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 space-y-4 w-full min-w-0" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants} className="border-b pb-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Audit Log Aktivitas</h1>
          <p className="text-gray-500 text-sm mt-1">Pantau dan lacak semua aktivitas sistem yang dilakukan oleh administrator.</p>
        </motion.div>

        {/* Filter Section (mirip orders) */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari log aktivitas..." 
              value={filters.search} 
              onChange={(e) => {
                setFilters(prev => ({ ...prev, search: e.target.value }));
                setPage(0);
              }} 
              className="pl-10 pr-4 py-2.5 border rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none bg-gray-50 text-sm sm:text-base"
            />
          </div>
          <select 
            name="action"
            value={filters.action} 
            onChange={handleFilterChange}
            className="border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-gray-50 text-sm sm:text-base"
          >
            <option value="all">Semua Aksi</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="login">Login</option>
          </select>
          <select 
            name="module"
            value={filters.module} 
            onChange={handleFilterChange}
            className="border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-gray-50 text-sm sm:text-base"
          >
            <option value="all">Semua Modul</option>
            <option value="products">Produk</option>
            <option value="orders">Pesanan</option>
            <option value="users">User</option>
            <option value="auth">Auth</option>
          </select>
        </motion.div>

        {/* Table Content */}
        <motion.div variants={itemVariants}>
          {loading.table ? (
            <>
              <div className="hidden lg:block">
                <LoadingTable />
              </div>
              <div className="lg:hidden">
                <LoadingCards />
              </div>
            </>
          ) : error ? ( // SEKARANG VARIABLE error SUDAH DIDEFINISIKAN
            <div className="text-center py-10 text-red-500 font-semibold text-sm sm:text-base">
              {error}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto w-full min-w-0">
                <table className="w-full text-sm border-collapse min-w-[800px]">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-gray-500 uppercase border-b border-gray-200">
                      <th className="py-3 px-4">No</th>
                      <th className="py-3 px-4">Admin</th>
                      <th className="py-3 px-4">Aksi</th>
                      <th className="py-3 px-4">Modul</th>
                      <th className="py-3 px-4">Deskripsi</th>
                      <th className="py-3 px-4">Waktu</th>
                      <th className="py-3 px-4">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedLogs.length > 0 ? (
                      paginatedLogs.map((log, index) => (
                        <tr key={log.id} className="hover:bg-gray-50 border-b border-gray-200 align-middle">
                          <td className="py-3 px-4 font-semibold text-gray-800">{startIndex + index + 1}</td>
                          <td className="py-3 px-4 font-medium text-gray-800">{log.user_name}</td>
                          <td className="py-3 px-4">{getActionBadge(log.action)}</td>
                          <td className="py-3 px-4 capitalize">{log.module}</td>
                          <td className="py-3 px-4 text-gray-600 max-w-[300px] truncate">{log.description}</td>
                          <td className="py-3 px-4 text-gray-500 text-sm whitespace-nowrap">{formatDate(log.created_at)}</td>
                          <td className="py-3 px-4">
                            <button 
                              onClick={() => handleViewDetail(log)} 
                              className="bg-gray-100 text-gray-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-200 transition flex items-center text-sm"
                            >
                              <Info className="w-4 h-4 mr-1.5" />
                              Lihat
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="py-8 px-4 text-center text-gray-400">
                          Tidak ada data log aktivitas ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {paginatedLogs.length > 0 ? (
                  paginatedLogs.map((log, index) => (
                    <LogCard 
                      key={log.id} 
                      log={log} 
                      index={startIndex + index}
                      onViewDetail={handleViewDetail} 
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    Tidak ada data log aktivitas ditemukan.
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>

        {/* Pagination (mirip orders) */}
        {logs.length > 0 && (
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-center gap-4 p-2 text-sm text-gray-600 border-t mt-4 pt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">Baris per halaman:</span>
              <select 
                value={rowsPerPage} 
                onChange={(e) => { 
                  setRowsPerPage(Number(e.target.value)); 
                  setPage(0); 
                }} 
                className="px-2 py-1 bg-transparent focus:outline-none border rounded text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage((p) => Math.max(p - 1, 0))} 
                disabled={page === 0} 
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-sm"
              >
                Sebelumnya
              </button>
              <span className="text-sm">
                {startIndex + 1}-{Math.min(endIndex, logs.length)} dari {logs.length}
              </span>
              <button 
                onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))} 
                disabled={page >= totalPages - 1} 
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-sm"
              >
                Berikutnya
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Detail Modal */}
      {selectedLog && (
        <Modal 
          isOpen={isDetailModalOpen} 
          onClose={() => setIsDetailModalOpen(false)} 
          title="Detail Log Aktivitas"
        >
          <div className="space-y-3 text-sm">
            <p><span className="font-semibold w-28 inline-block">Admin:</span> {selectedLog.user_name}</p>
            <p><span className="font-semibold w-28 inline-block">Aksi:</span> {selectedLog.action}</p>
            <p><span className="font-semibold w-28 inline-block">Modul:</span> {selectedLog.module}</p>
            <p><span className="font-semibold w-28 inline-block">Deskripsi:</span> {selectedLog.description}</p>
            <p><span className="font-semibold w-28 inline-block">IP Address:</span> {selectedLog.ip_address}</p>
            <p><span className="font-semibold w-28 inline-block">Waktu:</span> {formatDate(selectedLog.created_at)}</p>
            
            {selectedLog.old_values && (
              <div>
                <span className="font-semibold w-28 inline-block">Data Lama:</span>
                <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-auto max-h-40">
                  <code>{JSON.stringify(selectedLog.old_values, null, 2)}</code>
                </pre>
              </div>
            )}
            {selectedLog.new_values && (
              <div>
                <span className="font-semibold w-28 inline-block">Data Baru:</span>
                <pre className="bg-green-50 p-2 rounded mt-1 text-xs overflow-auto max-h-40">
                  <code>{JSON.stringify(selectedLog.new_values, null, 2)}</code>
                </pre>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default AuditLog;