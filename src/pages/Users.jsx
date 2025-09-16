import { useState, useEffect } from "react";
import { Search, Edit, Trash2 } from "lucide-react";

// Komponen utama untuk menampilkan manajemen pengguna.
const Users = () => {
  // State untuk data dan UI
  const [filterText, setFilterText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hook useEffect untuk mengambil data pengguna dari API saat komponen dimuat.
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null); // Reset error state sebelum fetch baru
      
      const token = localStorage.getItem("adminToken");
      if (!token) return window.location.href = "/login"; // fallback
      try {
        const response = await fetch('http://localhost:8000/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          throw new Error('Gagal mengambil data pengguna.');
        }

        const result = await response.json();
        if (result.success) {
          setUsers(result.data);
        } else {
          throw new Error(result.message || 'Respons API tidak berhasil.');
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

  // Fungsi untuk memformat tanggal ke format yang lebih mudah dibaca
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Handler untuk aksi edit
  const handleEdit = (user) => {
    console.log("Edit user:", user);
  };
  
  // Handler untuk aksi hapus
  const handleDelete = (id) => {
    console.log("Delete user with ID:", id);
  };

  // Memfilter pengguna berdasarkan teks pencarian
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(filterText.toLowerCase()) ||
      u.email.toLowerCase().includes(filterText.toLowerCase()) ||
      String(u.phone_number).toLowerCase().includes(filterText.toLowerCase())
  );

  // Logika paginasi
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  // Komponen skeleton loader saat data sedang dimuat
  const LoadingTable = () => (
    <div className="bg-white shadow rounded-lg overflow-hidden animate-pulse">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr className="text-left text-gray-500 uppercase border-b border-gray-200">
            <th className="py-3 px-4">ID</th>
            <th className="py-3 px-4">Nama</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Nomor HP</th>
            <th className="py-3 px-4">Jumlah Pembelian</th>
            <th className="py-3 px-4">Dibuat</th>
            <th className="py-3 px-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(rowsPerPage)].map((_, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-8"></div></td>
              <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
              <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
              <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
              <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-1/4"></div></td>
              <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
              <td className="py-3 px-4 flex items-center gap-2">
                <div className="h-6 w-16 bg-gray-200 rounded-lg"></div>
                <div className="h-6 w-16 bg-gray-200 rounded-lg"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen font-sans p-4 sm:p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Header */}
        <div className="mb-4 border-b pb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manajemen Users</h1>
          <p className="text-gray-500 text-sm mt-1">
            Daftar user beserta detail email, nomor HP, jumlah pembelian, dan tanggal dibuat.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64 mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari user..."
            value={filterText}
            onChange={(e) => { setFilterText(e.target.value); setPage(0); }}
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {loading ? (
          <LoadingTable />
        ) : error ? (
          <div className="text-center py-10 text-red-500 font-semibold">
            <p>Terjadi kesalahan: {error}</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-500 uppercase border-b border-gray-200">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Nama</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Nomor HP</th>
                  <th className="py-3 px-4">Jumlah Pembelian</th>
                  <th className="py-3 px-4">Dibuat</th>
                  <th className="py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 border-b border-gray-200">
                      <td className="py-3 px-4 font-semibold text-gray-800">{u.id}</td>
                      <td className="py-3 px-4 text-gray-700">{u.name}</td>
                      <td className="py-3 px-4 text-gray-700">{u.email}</td>
                      <td className="py-3 px-4 text-gray-700">{u.phone_number || 'N/A'}</td>
                      <td className="py-3 px-4 text-gray-700">{u.orders_count}x pembelian</td>
                      <td className="py-3 px-4 text-gray-600">{formatDate(u.created_at)}</td>
                      <td className="py-3 px-4 flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(u)}
                          className="bg-blue-100 text-blue-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-200 transition flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="bg-red-100 text-red-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-200 transition flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-3 px-4 text-center text-gray-400">
                      Tidak ada user ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4 text-sm text-gray-600 border-t">
              <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
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
                  Prev
                </button>
                <span>
                  {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
                  className="px-2 py-1 border rounded hover:bg-gray-100 disabled:text-gray-400"
                  disabled={page >= totalPages - 1}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
