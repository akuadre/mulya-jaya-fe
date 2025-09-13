import { useState } from "react";
import { Search, Edit, Trash2 } from "lucide-react";

const Users = () => {
  const [filterText, setFilterText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const users = [
    { id: 1, name: "Devon Lane", email: "devonlane@example.com", phone: "08123456789", purchases: 25, created: "23/12/2023 12:00" },
    { id: 2, name: "Wade Warren", email: "wadewarren@example.com", phone: "08234567890", purchases: 12, created: "04/12/2023 17:22" },
    { id: 3, name: "Jenny Wilson", email: "jennywilson@example.com", phone: "08345678901", purchases: 5, created: "10/11/2023 09:15" },
    { id: 4, name: "Kristin Watson", email: "kristinwatson@example.com", phone: "08456789012", purchases: 8, created: "01/10/2023 14:30" },
    { id: 5, name: "Cameron Williamson", email: "cameron@example.com", phone: "08567890123", purchases: 2, created: "15/09/2023 08:45" },
    { id: 6, name: "Arlene McCoy", email: "arlene@example.com", phone: "08678901234", purchases: 7, created: "20/08/2023 12:00" },
  ];

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(filterText.toLowerCase()) ||
      u.email.toLowerCase().includes(filterText.toLowerCase()) ||
      u.phone.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleEdit = (user) => console.log("Edit", user);
  const handleDelete = (id) => console.log("Delete", id);

  // Pagination logic
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
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

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-500 uppercase border-b border-gray-200">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Nama</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Nomor HP</th>
                <th className="py-3 px-4">Jumlah Pembelian</th>
                <th className="py-3 px-4">Created At</th>
               
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 border-b border-gray-200">
                  <td className="py-3 px-4 font-semibold text-gray-800">{u.id}</td>
                  <td className="py-3 px-4 text-gray-700">{u.name}</td>
                  <td className="py-3 px-4 text-gray-700">{u.email}</td>
                  <td className="py-3 px-4 text-gray-700">{u.phone}</td>
                  <td className="py-3 px-4 text-gray-700">{u.purchases}x pembelian</td>
                  <td className="py-3 px-4 text-gray-600">{u.created}</td>
                 
                </tr>
              ))}
              {paginatedUsers.length === 0 && (
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
                className="px-2 py-1 border rounded hover:bg-gray-100"
                disabled={page === 0}
              >
                Prev
              </button>
              <span>
                {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
                className="px-2 py-1 border rounded hover:bg-gray-100"
                disabled={page >= totalPages - 1}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
