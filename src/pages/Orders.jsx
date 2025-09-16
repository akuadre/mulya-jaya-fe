import { Search, Edit, XCircle } from "lucide-react";
import { useState, useEffect } from "react";

const Orders = () => {
  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/orders', {
          headers: {
            // Note: Hardcoded token is for development purposes. Use a secure method in production.
            'Authorization': 'Bearer 2|vaczTuz2a4eTfipfZc0yJJ9iwyML2j0LUpZDDOJN13d2c9c1'
          }
        });

        if (!response.ok) {
          throw new Error('Gagal mengambil data pesanan.');
        }

        const result = await response.json();
        if (result.success) {
          setOrders(result.data);
        } else {
          throw new Error(result.message || 'Respons API tidak berhasil.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const capitalizeStatus = (status) => {
    if (!status) return "";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  const handleStatusChange = (orderId, newStatus) => {
    // Note: Anda perlu mengimplementasikan panggilan API untuk memperbarui status di sini
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o)));
  };

  const handleEdit = (order) => {
    // Note: Fungsionalitas edit belum terhubung ke API. Silakan tambahkan endpoint edit.
    console.log("Edit order:", order);
    console.log("Fungsionalitas edit belum terhubung ke API. Silakan tambahkan endpoint edit.");
  };

  const filteredOrders = orders.filter(o => {
    const normalizedFilter = filterText.toLowerCase();

    const matchText =
      String(o.id).toLowerCase().includes(normalizedFilter) ||
      String(o.user?.name).toLowerCase().includes(normalizedFilter) ||
      String(o.product?.name).toLowerCase().includes(normalizedFilter) ||
      String(o.address).toLowerCase().includes(normalizedFilter) ||
      String(o.order_date).toLowerCase().includes(normalizedFilter) ||
      String(o.total_price).toLowerCase().includes(normalizedFilter) ||
      String(o.status).toLowerCase().includes(normalizedFilter) ||
      String(o.product?.description).toLowerCase().includes(normalizedFilter);

    const matchStatus = filterStatus === "Semua" ? true : o.status === filterStatus.toLowerCase();
    
    return matchText && matchStatus;
  });

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  const LoadingTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm animate-pulse">
        <thead className="bg-gray-50">
          <tr className="text-left text-gray-500 uppercase border-b border-gray-200">
            <th className="py-3 px-4">ID</th>
            <th className="py-3 px-4">Kode Pesanan</th>
            <th className="py-3 px-4">Pelanggan (Nama)</th>
            <th className="py-3 px-4">Produk</th>
            <th className="py-3 px-4">Total</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Dibuat Pada</th>
            <th className="py-3 px-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(rowsPerPage)].map((_, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-8"></div></td>
              <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-2/3"></div></td>
              <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
              <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
              <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
              <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-1/3"></div></td>
              <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
              <td className="py-3 px-4"><div className="h-6 w-16 bg-gray-200 rounded-lg"></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen font-sans p-4 sm:p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
        <div className="border-b pb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manajemen Pesanan</h1>
          <p className="text-gray-500 text-sm mt-1">
            Daftar pesanan beserta detail pelanggan, produk, total, status, dan tanggal dibuat.
          </p>
        </div>

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
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(0); }}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="Semua">Semua Status</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Diproses">Diproses</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>

        {loading ? (
          <LoadingTable />
        ) : error ? (
          <div className="text-center py-10 text-red-500 font-semibold">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-500 uppercase border-b border-gray-200">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Kode Pesanan</th>
                  <th className="py-3 px-4">Pelanggan (Nama)</th>
                  <th className="py-3 px-4">Produk</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Dibuat Pada</th>
                  <th className="py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map(o => (
                    <tr key={o.id} className="hover:bg-gray-50 border-b border-gray-200">
                      <td className="py-3 px-4 font-semibold text-gray-800">{o.id}</td>
                      <td className="py-3 px-4 text-gray-700">ORD-{String(o.id).padStart(3, '0')}</td>
                      <td className="py-3 px-4">{o.user?.name}</td>
                      <td className="py-3 px-4">{o.product?.name}</td>
                      <td className="py-3 px-4">{formatPrice(o.total_price)}</td>
                      <td className="py-3 px-4">
                        <select
                          value={capitalizeStatus(o.status)}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          className="border rounded-lg px-2 py-1 text-sm"
                        >
                          <option value="Menunggu">Menunggu</option>
                          <option value="Diproses">Diproses</option>
                          <option value="Selesai">Selesai</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{formatDate(o.created_at)}</td>
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
        )}

        <div className="flex justify-between items-center p-2 text-sm text-gray-600 border-t">
          <div className="flex items-center gap-2">
            <span>Baris per halaman:</span>
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
              Sebelumnya
            </button>
            <span>
              {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)} dari {filteredOrders.length}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
              disabled={page >= totalPages - 1}
              className="px-2 py-1 border rounded hover:bg-gray-100 disabled:text-gray-400"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
