import { useState, useEffect } from "react";
import { Search, X, Info, Mail, Phone, Calendar, ShoppingBag, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosClient from "../lib/axiosClient";

// --- KOMPONEN CARD UNTUK MOBILE ---
const UserCard = ({ user, index, onViewDetail }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      {/* Header dengan nama dan ID */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">{user.name}</h3>
            <p className="text-xs text-gray-500">ID: {user.id}</p>
          </div>
        </div>
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
          {user.orders_count}x belanja
        </span>
      </div>

      {/* Informasi Kontak */}
      <div className="space-y-2 text-sm mb-3">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600 truncate">{user.email}</span>
        </div>
        {user.phone_number && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{user.phone_number}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600 text-xs">{formatDate(user.created_at)}</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-3 border-t border-gray-100">
        <button
          onClick={() => onViewDetail(user)}
          className="w-full bg-blue-100 text-blue-700 font-medium px-3 py-2 rounded-lg hover:bg-blue-200 transition flex items-center justify-center text-sm"
        >
          <Info className="w-4 h-4 mr-1.5" />
          Lihat Detail
        </button>
      </div>
    </div>
  );
};

const Users = () => {
  const [filterText, setFilterText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response = await axiosClient.get("/api/users");
        const result = response.data;

        if (result.success) {
          setUsers(result.data);
        } else {
          throw new Error(result.message || "Respons API tidak berhasil.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const closeModal = () => setSelectedUser(null);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(filterText.toLowerCase()) ||
      u.email.toLowerCase().includes(filterText.toLowerCase()) ||
      String(u.phone_number).toLowerCase().includes(filterText.toLowerCase())
  );

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  const LoadingTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm animate-pulse">
        <thead className="bg-gray-50">
          <tr className="text-left text-gray-500 uppercase border-b border-gray-200">
            <th className="py-3 px-4">No</th>
            <th className="py-3 px-4">Nama</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Nomor HP</th>
            <th className="py-3 px-4">Pembelian</th>
            <th className="py-3 px-4">Bergabung</th>
            <th className="py-3 px-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(rowsPerPage)].map((_, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-8"></div></td>
              <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
              <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
              <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
              <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-1/4"></div></td>
              <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
              <td className="py-3 px-4"><div className="h-8 w-20 bg-gray-200 rounded-lg"></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const LoadingCards = () => (
    <div className="space-y-4">
      {[...Array(rowsPerPage)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
          <div className="flex justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="space-y-2 mb-3">
            <div className="h-3 bg-gray-200 rounded w-32"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded-lg"></div>
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
      <motion.div
        className="bg-white shadow-lg rounded-lg p-4 sm:p-6 w-full min-w-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-4 border-b pb-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
            Manajemen Pelanggan
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Lihat daftar pelanggan yang terdaftar di sistem Anda.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div variants={itemVariants} className="relative w-full sm:w-64 mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari pelanggan..."
            value={filterText}
            onChange={(e) => {
              setFilterText(e.target.value);
              setPage(0);
            }}
            className="pl-10 pr-4 py-2.5 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-sm sm:text-base"
          />
        </motion.div>

        {/* Content */}
        <motion.div variants={itemVariants}>
          {loading ? (
            <>
              {/* Loading untuk desktop (table) */}
              <div className="hidden lg:block">
                <LoadingTable />
              </div>
              {/* Loading untuk mobile (cards) */}
              <div className="lg:hidden">
                <LoadingCards />
              </div>
            </>
          ) : error ? (
            <div className="text-center py-10 text-red-500 font-semibold text-sm sm:text-base">
              <p>Terjadi kesalahan: {error}</p>
            </div>
          ) : (
            <>
              {/* Desktop View - Table */}
              <div className="hidden lg:block overflow-x-auto w-full min-w-0">
                <table className="w-full text-sm border-collapse min-w-[800px]">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-gray-500 uppercase border-b border-gray-200">
                      <th className="py-3 px-4">No</th>
                      <th className="py-3 px-4">Nama</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Nomor HP</th>
                      <th className="py-3 px-4">Jumlah Pembelian</th>
                      <th className="py-3 px-4">Bergabung</th>
                      <th className="py-3 px-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.length > 0 ? (
                      paginatedUsers.map((u, index) => (
                        <tr key={u.id} className="hover:bg-gray-50 border-b border-gray-200">
                          <td className="py-3 px-4 font-semibold text-gray-800">{startIndex + index + 1}</td>
                          <td className="py-3 px-4 text-gray-700 max-w-[150px] truncate">{u.name}</td>
                          <td className="py-3 px-4 text-gray-700 max-w-[200px] truncate">{u.email}</td>
                          <td className="py-3 px-4 text-gray-700">{u.phone_number || "N/A"}</td>
                          <td className="py-3 px-4 text-gray-700">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                              {u.orders_count}x pembelian
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600 text-sm whitespace-nowrap">{formatDate(u.created_at)}</td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => setSelectedUser(u)}
                              className="bg-blue-100 text-blue-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-200 transition flex items-center text-sm"
                            >
                              <Info className="w-4 h-4 mr-1" /> Detail
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="py-8 px-4 text-center text-gray-400">
                          Tidak ada pelanggan ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile View - Cards */}
              <div className="lg:hidden space-y-4">
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user, index) => (
                    <UserCard
                      key={user.id}
                      user={user}
                      index={index}
                      onViewDetail={setSelectedUser}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    Tidak ada pelanggan ditemukan.
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
        
        {/* Pagination */}
        {filteredUsers.length > 0 && (
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
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-sm"
                disabled={page === 0}
              >
                Sebelumnya
              </button>
              <span className="text-sm">
                {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} dari {filteredUsers.length}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-sm"
                disabled={page >= totalPages - 1}
              >
                Berikutnya
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Modal Detail User */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              
              {/* Header Modal */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Detail Pelanggan
                  </h2>
                  <p className="text-gray-500 text-sm">ID: {selectedUser.id}</p>
                </div>
              </div>

              {/* Informasi Detail */}
              <div className="space-y-4 text-gray-700 border-t pt-4">
                <div className="flex items-center gap-3">
                  <UserIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-gray-500">Nama Lengkap</p>
                    <p className="text-gray-800">{selectedUser.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-gray-500">Email</p>
                    <p className="text-gray-800 break-all">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-gray-500">Nomor Telepon</p>
                    <p className="text-gray-800">{selectedUser.phone_number || "Tidak ada"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-gray-500">Total Pesanan</p>
                    <p className="text-gray-800">{selectedUser.orders_count} kali pembelian</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-gray-500">Tanggal Bergabung</p>
                    <p className="text-gray-800">{formatDate(selectedUser.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Footer Modal */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="w-full bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Users;