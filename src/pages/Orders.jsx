import { Search, Edit, Trash2, XCircle } from "lucide-react";
import { useState } from "react";

const Orders = () => {
  const [filterText, setFilterText] = useState("");
  const [filterJenis, setFilterJenis] = useState("Semua");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const [orders, setOrders] = useState([
    { id: 1, kodePesanan: "ORD-001", customer: "Devon Lane", product: "Kemeja Batik", total: "Rp250.000", status: "Menunggu", created: "23/12/2023 12:00" },
    { id: 2, kodePesanan: "ORD-002", customer: "Wade Warren", product: "Tas Kulit", total: "Rp1.200.000", status: "Diproses", created: "04/12/2023 17:22" },
    { id: 3, kodePesanan: "ORD-003", customer: "Cameron Williamson", product: "Sepatu Sneakers", total: "Rp800.000", status: "Selesai", created: "05/01/2024 09:30" },
  ]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleStatusChange = (id, newStatus) => {
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, status: newStatus } : o)));
  };

  const handleEdit = (order) => {
    setEditData({ ...order });
    setIsEditModalOpen(true);
  };

  const handleEditSave = () => {
    setOrders(prev => prev.map(o => (o.id === editData.id ? editData : o)));
    setIsEditModalOpen(false);
    setEditData(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah yakin ingin menghapus pesanan ini?")) {
      setOrders(prev => prev.filter(o => o.id !== id));
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchText =
      o.customer.toLowerCase().includes(filterText.toLowerCase()) ||
      o.product.toLowerCase().includes(filterText.toLowerCase()) ||
      o.kodePesanan.toLowerCase().includes(filterText.toLowerCase());

    const matchJenis = filterJenis === "Semua" ? true : o.status === filterJenis;

    return matchText && matchJenis;
  });

  // Pagination
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* Card Utuh */}
      <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
        {/* Header */}
        <div className="border-b pb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manajemen Pesanan</h1>
          <p className="text-gray-500 text-sm mt-1">
            Daftar pesanan beserta detail pelanggan, produk, total, status, dan tanggal dibuat.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari pesanan..."
              value={filterText}
              onChange={(e) => { setFilterText(e.target.value); setPage(0); }}
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <select
            value={filterJenis}
            onChange={(e) => { setFilterJenis(e.target.value); setPage(0); }}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="Semua">Semua Status</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Diproses">Diproses</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-500 uppercase border-b border-gray-200">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Kode Pesanan</th>
                <th className="py-3 px-4">Pelanggan</th>
                <th className="py-3 px-4">Produk</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created At</th>
                <th className="py-3 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50 border-b border-gray-200">
                    <td className="py-3 px-4 font-semibold text-gray-800">{o.id}</td>
                    <td className="py-3 px-4 text-gray-700">{o.kodePesanan}</td>
                    <td className="py-3 px-4">{o.customer}</td>
                    <td className="py-3 px-4">{o.product}</td>
                    <td className="py-3 px-4">{o.total}</td>
                    <td className="py-3 px-4">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className="border rounded-lg px-2 py-1 text-sm"
                      >
                        <option value="Menunggu">Menunggu</option>
                        <option value="Diproses">Diproses</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{o.created}</td>
                    <td className="py-3 px-4 flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(o)}
                        className="bg-blue-100 text-blue-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-200 transition flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-1" /> Edit
                      </button>
                     
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-3 px-4 text-center text-gray-400">
                    Tidak ada pesanan ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center p-2 text-sm text-gray-600 border-t">
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
              disabled={page === 0}
              className="px-2 py-1 border rounded hover:bg-gray-100 disabled:text-gray-400"
            >
              Prev
            </button>
            <span>
              {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
              disabled={page >= totalPages - 1}
              className="px-2 py-1 border rounded hover:bg-gray-100 disabled:text-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal Edit */}
      {isEditModalOpen && editData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Edit Pesanan</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <form className="space-y-4">
              <input type="text" value={editData.customer} onChange={(e) => setEditData({ ...editData, customer: e.target.value })} className="w-full border p-2 rounded" placeholder="Nama pelanggan" />
              <input type="text" value={editData.product} onChange={(e) => setEditData({ ...editData, product: e.target.value })} className="w-full border p-2 rounded" placeholder="Produk" />
              <input type="text" value={editData.total} onChange={(e) => setEditData({ ...editData, total: e.target.value })} className="w-full border p-2 rounded" placeholder="Total" />
              <select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })} className="w-full border p-2 rounded">
                <option value="Menunggu">Menunggu</option>
                <option value="Diproses">Diproses</option>
                <option value="Selesai">Selesai</option>
              </select>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition">Batal</button>
                <button type="button" onClick={handleEditSave} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
