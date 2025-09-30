import { useState, useEffect } from "react";
import { Search, X, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // <-- Import Framer Motion

const Users = () => {
  // ... (Semua state dan fungsi Anda dari baris 5 sampai 105 tetap sama)
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
      const token = localStorage.getItem("adminToken");
      if (!token) return (window.location.href = "/login");

      try {
        const response = await fetch("http://localhost:8000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Gagal mengambil data pengguna.");
        const result = await response.json();
        if (result.success) {
          setUsers(result.data);
        } else {
          throw new Error(result.message || "Respons API tidak berhasil.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
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
                <th className="py-3 px-4">Jumlah Pembelian</th>
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

  // Varian animasi
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    // PERUBAHAN 1: Hapus div luar, ganti dengan motion.div
    <>
      <motion.div
        className="bg-white shadow-lg rounded-lg p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-4 border-b pb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Manajemen Pelanggan
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Lihat daftar pelanggan yang terdaftar di sistem Anda.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="relative w-full md:w-64 mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari pelanggan..."
            value={filterText}
            onChange={(e) => {
              setFilterText(e.target.value);
              setPage(0);
            }}
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="overflow-x-auto">
          {loading ? (
            <LoadingTable />
          ) : error ? (
            <div className="text-center py-10 text-red-500 font-semibold">
              <p>Terjadi kesalahan: {error}</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-500 uppercase border-b border-gray-200">
                  <th className="py-3 px-4">NO</th>
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
                      <td className="py-3 px-4 text-gray-700">{u.name}</td>
                      <td className="py-3 px-4 text-gray-700">{u.email}</td>
                      <td className="py-3 px-4 text-gray-700">{u.phone_number || "N/A"}</td>
                      <td className="py-3 px-4 text-gray-700">{u.orders_count}x pembelian</td>
                      <td className="py-3 px-4 text-gray-600">{formatDate(u.created_at)}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="bg-blue-100 text-blue-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-200 transition flex items-center"
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
          )}
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex justify-between items-center p-2 text-sm text-gray-600 border-t mt-4">
            <div className="flex items-center gap-2">
                <span>Baris per halaman:</span>
                <select
                    value={rowsPerPage}
                    onChange={(e) => {
                        setRowsPerPage(Number(e.target.value));
                        setPage(0);
                    }}
                    className="px-1 py-0 bg-transparent focus:outline-none border rounded"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                </select>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setPage((p) => Math.max(p - 1, 0))}
                    className="px-2 py-1 border rounded hover:bg-gray-100 disabled:text-gray-400"
                    disabled={page === 0}
                >
                    Sebelumnya
                </button>
                <span>
                    {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} dari {filteredUsers.length}
                </span>
                <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
                    className="px-2 py-1 border rounded hover:bg-gray-100 disabled:text-gray-400"
                    disabled={page >= totalPages - 1}
                >
                    Berikutnya
                </button>
            </div>
        </motion.div>
      </motion.div>

      {/* PERUBAHAN 2: Bungkus modal dengan AnimatePresence */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-8 relative"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Detail Pelanggan
              </h2>
              <div className="space-y-3 text-gray-700 border-t pt-4">
                  <p><span className="font-semibold w-32 inline-block">ID</span>: {selectedUser.id}</p>
                  <p><span className="font-semibold w-32 inline-block">Nama</span>: {selectedUser.name}</p>
                  <p><span className="font-semibold w-32 inline-block">Email</span>: {selectedUser.email}</p>
                  <p><span className="font-semibold w-32 inline-block">Nomor HP</span>: {selectedUser.phone_number || "Tidak ada"}</p>
                  <p><span className="font-semibold w-32 inline-block">Total Pesanan</span>: {selectedUser.orders_count} kali</p>
                  <p><span className="font-semibold w-32 inline-block">Tanggal Bergabung</span>: {formatDate(selectedUser.created_at)}</p>
              </div>
              <div className="mt-8 text-right">
                <button
                  onClick={closeModal}
                  className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition"
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