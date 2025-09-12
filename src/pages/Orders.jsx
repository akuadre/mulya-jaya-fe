// src/pages/Orders.jsx
import React, { useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      tanggal: "2025-09-01",
      pesanan: "#ORD-00123",
      pelanggan: "Budi Santoso",
      status: "Selesai",
      total: "Rp 1.200.000",
    },
    {
      tanggal: "2025-09-02",
      pesanan: "#ORD-00124",
      pelanggan: "Siti Aminah",
      status: "Diproses",
      total: "Rp 800.000",
    },
    {
      tanggal: "2025-09-03",
      pesanan: "#ORD-00125",
      pelanggan: "Agus Kurniawan",
      status: "Dibatalkan",
      total: "Rp 500.000",
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // styling status
  const getStatusStyle = (status) => {
    if (status === "Selesai") return "bg-emerald-100 text-emerald-700";
    if (status === "Diproses") return "bg-yellow-100 text-yellow-700";
    if (status === "Dibatalkan") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  // open modal edit
  const handleEdit = (order) => {
    setEditData(order);
    setIsEditModalOpen(true);
  };

  // hapus order
  const handleDelete = (index) => {
    if (confirm("Yakin hapus pesanan ini?")) {
      setOrders(orders.filter((_, i) => i !== index));
    }
  };

  return (
    <div>
      {/* Judul + Tombol Tambah */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Daftar Pesanan</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          + Tambah Pesanan
        </button>
      </div>

      {/* Tabel Pesanan */}
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-semibold border-b">No</th>
              <th className="px-6 py-3 text-left font-semibold border-b">
                Tanggal
              </th>
              <th className="px-6 py-3 text-left font-semibold border-b">
                Pesanan
              </th>
              <th className="px-6 py-3 text-left font-semibold border-b">
                Pelanggan
              </th>
              <th className="px-6 py-3 text-left font-semibold border-b">
                Status
              </th>
              <th className="px-6 py-3 text-left font-semibold border-b">
                Total
              </th>
              <th className="px-6 py-3 text-left font-semibold border-b">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 border-b border-gray-300">{i + 1}</td>
                <td className="px-6 py-4 border-b border-gray-300">
                  {row.tanggal}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  {row.pesanan}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  {row.pelanggan}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  <span
                    className={`${getStatusStyle(
                      row.status
                    )} px-3 py-1 rounded-full text-xs font-semibold`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 border-b border-gray-300 font-medium">
                  {row.total}
                </td>
                <td className="px-6 py-4 border-b border-gray-300 space-x-2">
                  <button
                    onClick={() => handleEdit(row)}
                    className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs rounded-md shadow"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(i)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-md shadow"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70">
          <div className="bg-white p-6 rounded-lg shadow w-96">
            <h2 className="text-lg font-bold mb-4">Tambah Pesanan</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Tanggal"
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="No Pesanan"
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Pelanggan"
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Total"
                className="w-full border p-2 rounded"
              />
              <select className="w-full border p-2 rounded">
                <option value="">Pilih Status</option>
                <option>Selesai</option>
                <option>Diproses</option>
                <option>Dibatalkan</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  Batal
                </button>
                <button className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit */}
      {isEditModalOpen && editData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70">
          <div className="bg-white p-6 rounded-lg shadow w-96">
            <h2 className="text-lg font-bold mb-4">Edit Pesanan</h2>
            <form className="space-y-4">
              <input
                type="text"
                defaultValue={editData.tanggal}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                defaultValue={editData.pesanan}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                defaultValue={editData.pelanggan}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                defaultValue={editData.total}
                className="w-full border p-2 rounded"
              />
              <select
                defaultValue={editData.status}
                className="w-full border p-2 rounded"
              >
                <option>Selesai</option>
                <option>Diproses</option>
                <option>Dibatalkan</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  Batal
                </button>
                <button className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
