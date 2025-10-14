import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Search, StepForward } from "lucide-react";
import { motion } from "framer-motion";

import axiosClient from "../lib/axiosClient";

// Impor komponen UI
// Pastikan path ini sesuai dengan struktur folder Anda
import Modal from "../components/Modal";
import Notification, { useNotification } from "../components/Notification";

const Orders = () => {
  const authToken = localStorage.getItem("adminToken");

  // --- STATE MANAGEMENT ---
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  
  const { notification, showNotification, dismissNotification } = useNotification();

  // --- DATA & CONFIGURATION ---

  const statusMap = useMemo(() => ({
    pending: "Menunggu",
    processing: "Diproses",
    sending: "Dikirim",
    completed: "Selesai",
    cancelled: "Dibatalkan"
  }), []);

  const statusColors = useMemo(() => ({
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    sending: "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800"
  }), []);


  // --- FUNGSI-FUNGSI LOGIKA ---

  const fetchOrders = async () => {
    if (!authToken) return window.location.href = "/login";
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get('api/orders');
      setOrders(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (err) {
      setError(err.message || 'Gagal mengambil data pesanan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;
    setIsSubmitting(true);
    try {
      await axiosClient.put(`api/orders/${selectedOrder.id}/status`, 
        { status: newStatus }
      );
      setOrders(prev => prev.map(o => (o.id === selectedOrder.id ? { ...o, status: newStatus } : o)));
      setIsModalOpen(false);
      // PERBAIKAN: Panggil notifikasi dengan format (message, type)
      showNotification('Status pesanan telah diperbarui.', 'success');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Gagal memperbarui status.';
      // PERBAIKAN: Panggil notifikasi dengan format (message, type)
      showNotification(errorMsg, 'error');
    } finally { 
      setIsSubmitting(false);
    }
  };
  
  const filteredOrders = useMemo(() => orders.filter(o => {
    const normalizedFilter = filterText.toLowerCase();
    const matchText =
      String(o.id).toLowerCase().includes(normalizedFilter) ||
      String(o.user?.name).toLowerCase().includes(normalizedFilter) ||
      String(o.product?.name).toLowerCase().includes(normalizedFilter);
    const matchStatus = filterStatus === "Semua" ? true : o.status === filterStatus;
    return matchText && matchStatus;
  }), [orders, filterText, filterStatus]);

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage; // <-- PERBAIKAN: Variabel endIndex ditambahkan
  const paginatedOrders = useMemo(() => filteredOrders.slice(startIndex, endIndex), [filteredOrders, startIndex, endIndex]);
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  // --- KOMPONEN UI LOKAL ---

  const LoadingTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm animate-pulse">
        <thead className="bg-gray-50"><tr className="text-left text-gray-500 uppercase border-b border-gray-200"><th className="py-3 px-4">NO</th><th className="py-3 px-4">Kode Pesanan</th><th className="py-3 px-4">Pelanggan</th><th className="py-3 px-4">Produk</th><th className="py-3 px-4">Total</th><th className="py-3 px-4">Metode Pembayaran</th><th className="py-3 px-4">Status</th><th className="py-3 px-4">Dibuat Pada</th><th className="py-3 px-4">Aksi</th></tr></thead>
        <tbody>
          {[...Array(rowsPerPage)].map((_, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-8"></div></td>
              <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-2/3"></div></td>
              <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
              <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
              <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
              <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-1/3"></div></td>
              <td className="py-3 px-4"><div className="h-6 w-20 bg-gray-200 rounded-full"></div></td>
              <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
              <td className="py-3 px-4"><div className="h-8 w-24 bg-gray-200 rounded-lg"></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  // --- RENDER JSX ---
  return (
    <>
      <Notification notification={notification} onDismiss={dismissNotification} />
      
      <motion.div className="bg-white shadow-lg rounded-lg p-6 space-y-4" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants} className="border-b pb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manajemen Pesanan</h1>
          <p className="text-gray-500 text-sm mt-1">Lacak dan perbarui status pesanan dari pelanggan Anda.</p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Cari pesanan..." value={filterText} onChange={(e) => { setFilterText(e.target.value); setPage(0); }} className="pl-10 pr-4 py-2.5 border rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none bg-gray-50"/>
          </div>
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(0); }} className="border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-gray-50">
            <option value="Semua">Semua Status</option>
            {Object.keys(statusMap).map(statusKey => (
              <option key={statusKey} value={statusKey}>{statusMap[statusKey]}</option>
            ))}
          </select>
        </motion.div>

        <motion.div variants={itemVariants} className="overflow-x-auto">
          {loading ? <LoadingTable /> : error ? <div className="text-center py-10 text-red-500 font-semibold">{error}</div> : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr className="text-left text-gray-500 uppercase border-b border-gray-200"><th className="py-3 px-4">No</th><th className="py-3 px-4">Kode Pesanan</th><th className="py-3 px-4">Pelanggan</th><th className="py-3 px-4">Produk</th><th className="py-3 px-4">Total</th><th className="py-3 px-4">Metode Pembayaran</th><th className="py-3 px-4">Status</th><th className="py-3 px-4">Dibuat Pada</th><th className="py-3 px-4">Aksi</th></tr></thead>
              <tbody>
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((o, index) => (
                    <tr key={o.id} className="hover:bg-gray-50 border-b border-gray-200 align-middle">
                      <td className="py-3 px-4 font-semibold text-gray-800">{startIndex + index + 1}</td>
                      <td className="py-3 px-4 text-gray-700 font-mono">ORD-{String(o.id).padStart(4, '0')}</td>
                      <td className="py-3 px-4">{o.user?.name || '-'}</td>
                      <td className="py-3 px-4">{o.product?.name || '-'}</td>
                      <td className="py-3 px-4 font-semibold">{formatPrice(o.total_price)}</td>
                      <td className="py-3 px-4 capitalize">{o.payment_method || '-'}</td>
                      <td className="py-3 px-4"><span className={`py-1 px-2.5 rounded-full text-xs font-medium ${statusColors[o.status] || ''}`}>{statusMap[o.status] || o.status}</span></td>
                      <td className="py-3 px-4 text-gray-600">{formatDate(o.created_at)}</td>
                      <td className="py-3 px-4"><button onClick={() => handleEdit(o)} className="bg-gray-100 text-gray-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-200 transition flex items-center"><StepForward className="w-4 h-4 mr-1.5" /> Ubah Status</button></td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="8" className="py-8 px-4 text-center text-gray-400">Tidak ada pesanan ditemukan.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-between items-center p-2 text-sm text-gray-600 border-t">
          <div className="flex items-center gap-2"><span>Baris per halaman:</span><select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }} className="px-1 py-0 bg-transparent focus:outline-none border rounded"><option value={5}>5</option><option value={10}>10</option><option value={25}>25</option></select></div>
          <div className="flex items-center gap-2"><button onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={page === 0} className="px-2 py-1 border rounded hover:bg-gray-100 disabled:text-gray-400">Sebelumnya</button><span>{startIndex + 1}-{Math.min(endIndex, filteredOrders.length)} dari {filteredOrders.length}</span><button onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))} disabled={page >= totalPages - 1} className="px-2 py-1 border rounded hover:bg-gray-100 disabled:text-gray-400">Berikutnya</button></div>
        </motion.div>
      </motion.div>
      
      {selectedOrder && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          title="Ubah Status Pesanan"
          footer={
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300" disabled={isSubmitting}>Batal</button>
              <button onClick={handleUpdateStatus} className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400" disabled={isSubmitting}>{isSubmitting ? "Menyimpan..." : "Simpan"}</button>
            </div>
          }
        >
          <div className="space-y-4">
             <p className="text-sm text-gray-500">
                Kode Pesanan: <span className="font-semibold font-mono text-gray-700">ORD-{String(selectedOrder.id).padStart(4, '0')}</span>
              </p>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1.5">Pilih Status Baru</label>
              <select id="status" value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500">
                {Object.keys(statusMap).map(statusKey => (
                  <option key={statusKey} value={statusKey}>{statusMap[statusKey]}</option>
                ))}
              </select>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Orders;

