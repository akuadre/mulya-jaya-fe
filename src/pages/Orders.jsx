import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Search,
  MoreVertical,
  Calendar,
  User,
  Package,
  DollarSign,
  CreditCard,
  Eye,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";

// Asumsikan axiosClient sudah di-setup
const axiosClient = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor untuk menambahkan token ke setiap request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

// Impor komponen UI
import Modal from "../components/Modal";
import Notification, { useNotification } from "../components/Notification";

// --- KOMPONEN CARD UNTUK MOBILE ---
const OrderCard = ({ order, onViewDetail }) => {
  const statusMap = {
    pending: "Menunggu",
    processing: "Diproses",
    sending: "Dikirim",
    completed: "Selesai",
    cancelled: "Dibatalkan",
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    sending: "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const lensaTypeMap = {
    without: "Tanpa Lensa",
    normal: "Lensa Normal", 
    custom: "Lensa Custom"
  };

  const lensaColors = {
    without: "bg-gray-100 text-gray-800",
    normal: "bg-green-100 text-green-800",
    custom: "bg-blue-100 text-blue-800"
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">
            ORD-{String(order.id).padStart(4, "0")}
          </h3>
          <p className="text-xs text-gray-500 mt-1 flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(order.created_at)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`py-1 px-2.5 rounded-full text-xs font-medium ${
              statusColors[order.status] || ""
            }`}
          >
            {statusMap[order.status] || order.status}
          </span>
          <span
            className={`py-1 px-2 rounded-full text-xs font-medium ${
              lensaColors[order.lensa_type] || ""
            }`}
          >
            {lensaTypeMap[order.lensa_type] || order.lensa_type}
          </span>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{order.user?.name || "-"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600 truncate">
            {order.product?.name || "-"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-800">
            {formatPrice(order.total_price)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600 capitalize">
            {order.payment_method || "-"}
          </span>
        </div>

        {/* Tampilkan info custom lensa jika ada */}
        {order.lensa_type === 'custom' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mt-2">
            <div className="flex items-center gap-2 text-blue-700 text-xs">
              <FileText className="w-3 h-3" />
              <span className="font-semibold">Lensa Custom</span>
            </div>
            {order.photo_url && (
              <div className="text-blue-600 text-xs mt-1">
                • Dengan Resep Dokter
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100">
        <button
          onClick={() => onViewDetail(order)}
          className="w-full bg-gray-100 text-gray-700 font-medium px-3 py-2 rounded-lg hover:bg-gray-200 transition flex items-center justify-center text-sm"
        >
          <MoreVertical className="w-4 h-4 mr-1.5" />
          Detail & Aksi
        </button>
      </div>
    </div>
  );
};

const Orders = () => {
  const authToken = localStorage.getItem("adminToken");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // State untuk modal foto
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState("");

  const { notification, showNotification, dismissNotification } =
    useNotification();

  const statusMap = useMemo(
    () => ({
      pending: "Menunggu",
      processing: "Diproses",
      sending: "Dikirim",
      completed: "Selesai",
      cancelled: "Dibatalkan",
    }),
    []
  );

  const statusColors = useMemo(
    () => ({
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      sending: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    }),
    []
  );

  const lensaTypeMap = useMemo(
    () => ({
      without: "Tanpa Lensa",
      normal: "Lensa Normal", 
      custom: "Lensa Custom"
    }),
    []
  );

  const fetchOrders = async () => {
    if (!authToken) return (window.location.href = "/login");
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get("/api/orders");
      setOrders(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (err) {
      setError(err.message || "Gagal mengambil data pesanan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsDetailModalOpen(true);
  };

  const handleViewPhoto = () => {
    if (selectedOrder?.photo_url) {
      setSelectedPhoto(selectedOrder.photo_url);
      setIsPhotoModalOpen(true);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus || newStatus === selectedOrder.status)
      return;

    setIsSubmitting(true);
    try {
      await axiosClient.put(`api/orders/${selectedOrder.id}/status`, {
        status: newStatus,
      });
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: newStatus } : o
        )
      );
      setIsDetailModalOpen(false);
      showNotification("Status pesanan telah diperbarui.", "success");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Gagal memperbarui status.";
      showNotification(errorMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredOrders = useMemo(
    () =>
      orders.filter((o) => {
        const normalizedFilter = filterText.toLowerCase();
        const matchText =
          String(o.id).toLowerCase().includes(normalizedFilter) ||
          String(o.user?.name).toLowerCase().includes(normalizedFilter) ||
          String(o.product?.name).toLowerCase().includes(normalizedFilter) ||
          String(o.lensa_type).toLowerCase().includes(normalizedFilter);
        const matchStatus =
          filterStatus === "Semua" ? true : o.status === filterStatus;
        return matchText && matchStatus;
      }),
    [orders, filterText, filterStatus]
  );

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedOrders = useMemo(
    () => filteredOrders.slice(startIndex, endIndex),
    [filteredOrders, startIndex, endIndex]
  );
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  const LoadingTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm animate-pulse">
        <thead className="bg-gray-50">
          <tr className="text-left text-gray-500 uppercase border-b border-gray-200">
            <th className="py-3 px-4">No</th>
            <th className="py-3 px-4">Kode Pesanan</th>
            <th className="py-3 px-4">Pelanggan</th>
            <th className="py-3 px-4">Produk</th>
            <th className="py-3 px-4">Total</th>
            <th className="py-3 px-4">Metode Pembayaran</th>
            <th className="py-3 px-4">Jenis Lensa</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(rowsPerPage)].map((_, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-3 px-4">
                <div className="h-4 bg-gray-200 rounded w-8"></div>
              </td>
              <td className="py-3 px-4">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </td>
              <td className="py-3 px-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </td>
              <td className="py-3 px-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </td>
              <td className="py-3 px-4">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </td>
              <td className="py-3 px-4">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </td>
              <td className="py-3 px-4">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </td>
              <td className="py-3 px-4">
                <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
              </td>
              <td className="py-3 px-4">
                <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const LoadingCards = () => (
    <div className="space-y-4">
      {[...Array(rowsPerPage)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse"
        >
          <div className="flex justify-between mb-3">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="space-y-1">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-32"></div>
            <div className="h-3 bg-gray-200 rounded w-28"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded-lg mt-3"></div>
        </div>
      ))}
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <>
      <Notification
        notification={notification}
        onDismiss={dismissNotification}
      />
      <motion.div
        className="bg-white shadow-lg rounded-lg p-4 sm:p-6 space-y-4 w-full min-w-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="border-b pb-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
            Manajemen Pesanan
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Lacak dan perbarui status pesanan dari pelanggan Anda.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari pesanan..."
              value={filterText}
              onChange={(e) => {
                setFilterText(e.target.value);
                setPage(0);
              }}
              className="pl-10 pr-4 py-2.5 border rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none bg-gray-50 text-sm sm:text-base"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(0);
            }}
            className="border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-gray-50 text-sm sm:text-base"
          >
            <option value="Semua">Semua Status</option>
            {Object.keys(statusMap).map((statusKey) => (
              <option key={statusKey} value={statusKey}>
                {statusMap[statusKey]}
              </option>
            ))}
          </select>
        </motion.div>

        <motion.div variants={itemVariants}>
          {loading ? (
            <>
              <div className="hidden lg:block">
                <LoadingTable />
              </div>
              <div className="lg:hidden">
                <LoadingCards />
              </div>
            </>
          ) : error ? (
            <div className="text-center py-10 text-red-500 font-semibold text-sm sm:text-base">
              {error}
            </div>
          ) : (
            <>
              <div className="hidden lg:block overflow-x-auto w-full min-w-0">
                <table className="w-full text-sm border-collapse min-w-[800px]">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-gray-500 uppercase border-b border-gray-200">
                      <th className="py-3 px-4">No</th>
                      <th className="py-3 px-4">Kode Pesanan</th>
                      <th className="py-3 px-4">Pelanggan</th>
                      <th className="py-3 px-4">Produk</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Metode Pembayaran</th>
                      <th className="py-3 px-4">Jenis Lensa</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.length > 0 ? (
                      paginatedOrders.map((o, index) => {
                        const isCustomLense = o.lensa_type === 'custom';

                        return (
                          <tr
                            key={o.id}
                            className="hover:bg-gray-50 border-b border-gray-200 align-middle"
                          >
                            <td className="py-3 px-4 font-semibold text-gray-800">
                              {startIndex + index + 1}
                            </td>
                            <td className="py-3 px-4 text-gray-700 font-mono text-sm">
                              ORD-{String(o.id).padStart(4, "0")}
                            </td>
                            <td className="py-3 px-4 max-w-[120px] truncate">
                              {o.user?.name || "-"}
                            </td>
                            <td className="py-3 px-4 max-w-[150px] truncate">
                              {o.product?.name || "-"}
                            </td>
                            <td className="py-3 px-4 font-semibold whitespace-nowrap">
                              {formatPrice(o.total_price)}
                            </td>
                            <td className="py-3 px-4 capitalize">
                              {o.payment_method || "-"}
                            </td>
                            <td className="py-3 px-4">
                              {isCustomLense ? (
                                <span className="text-blue-600 font-medium text-xs bg-blue-50 px-2 py-1 rounded">
                                  Custom
                                </span>
                              ) : o.lensa_type === 'normal' ? (
                                <span className="text-green-600 font-medium text-xs bg-green-50 px-2 py-1 rounded">
                                  Normal
                                </span>
                              ) : (
                                <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded">
                                  Tanpa Lensa
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`py-1 px-2.5 rounded-full text-xs font-medium ${
                                  statusColors[o.status] || ""
                                }`}
                              >
                                {statusMap[o.status] || o.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => handleViewDetail(o)}
                                className="bg-gray-100 text-gray-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-200 transition flex items-center text-sm"
                              >
                                <MoreVertical className="w-4 h-4 mr-1" />
                                Detail
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="9"
                          className="py-8 px-4 text-center text-gray-400"
                        >
                          Tidak ada pesanan ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="lg:hidden space-y-4">
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order, index) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      index={index}
                      onViewDetail={handleViewDetail}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    Tidak ada pesanan ditemukan.
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>

        {filteredOrders.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-between items-center gap-4 p-2 text-sm text-gray-600 border-t mt-4 pt-4"
          >
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
                {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)}{" "}
                dari {filteredOrders.length}
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

      {/* Modal untuk detail dan aksi */}
      {selectedOrder && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedOrder(null);
          }}
          title={`Detail Pesanan - ORD-${String(selectedOrder.id).padStart(4, "0")}`}
          size="lg"
          footer={
            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <div className="flex gap-2">
                {selectedOrder.lensa_type === 'custom' && selectedOrder.photo_url && (
                  <button
                    onClick={handleViewPhoto}
                    className="bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-lg hover:bg-blue-200 transition flex items-center text-sm"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Lihat Foto Resep
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    setSelectedOrder(null);
                  }}
                  className="bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
                  disabled={isSubmitting}
                >
                  Tutup
                </button>
                <button
                  onClick={handleUpdateStatus}
                  className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition text-sm sm:text-base"
                  disabled={isSubmitting || newStatus === selectedOrder.status}
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Status"}
                </button>
              </div>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Informasi Dasar */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Informasi Pesanan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Pelanggan</p>
                  <p className="font-semibold text-gray-800">{selectedOrder.user?.name || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Produk</p>
                  <p className="font-semibold text-gray-800">{selectedOrder.product?.name || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Harga</p>
                  <p className="font-semibold text-gray-800">{formatPrice(selectedOrder.total_price)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Metode Pembayaran</p>
                  <p className="font-semibold text-gray-800 capitalize">{selectedOrder.payment_method || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Jenis Lensa</p>
                  <p className="font-semibold text-gray-800">{lensaTypeMap[selectedOrder.lensa_type] || selectedOrder.lensa_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dibuat Pada</p>
                  <p className="font-semibold text-gray-800">{formatDate(selectedOrder.created_at)}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Alamat Pengiriman</p>
                  <p className="font-semibold text-gray-800">{selectedOrder.address || "-"}</p>
                </div>
              </div>
            </div>

            {/* Ubah Status */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Ubah Status</h3>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Status Saat Ini:{" "}
                  <span className={`font-semibold ${statusColors[selectedOrder.status] || ""} px-2 py-1 rounded`}>
                    {statusMap[selectedOrder.status] || selectedOrder.status}
                  </span>
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                >
                  {Object.keys(statusMap).map((statusKey) => (
                    <option key={statusKey} value={statusKey}>
                      {statusMap[statusKey]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal untuk menampilkan foto */}
      {selectedPhoto && (
        <Modal
          isOpen={isPhotoModalOpen}
          onClose={() => {
            setIsPhotoModalOpen(false);
            setSelectedPhoto("");
          }}
          title="Foto Resep Dokter - Lensa Custom"
          size="lg"
          footer={
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setIsPhotoModalOpen(false);
                  setSelectedPhoto("");
                }}
                className="bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
              >
                Tutup
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <img
                src={selectedPhoto}
                alt="Resep Dokter"
                className="max-w-full max-h-96 mx-auto rounded-lg shadow-sm"
                onError={(e) => {
                  console.error("Gagal load gambar:", selectedPhoto);
                  e.target.src =
                    "https://via.placeholder.com/400x300?text=Gambar+Tidak+Tersedia";
                }}
              />
            </div>
            <p className="text-sm text-gray-500 text-center">
              Foto resep dokter untuk lensa custom. Pastikan resep sudah lengkap
              dan jelas.
            </p>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Orders;