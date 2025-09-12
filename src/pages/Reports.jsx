import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const Reports = () => {
  const [data] = useState([
    {
      tanggal: "2025-09-01",
      pesanan: "#ORD-00123",
      total: 1200000,
      status: "Selesai",
    },
    {
      tanggal: "2025-09-02",
      pesanan: "#ORD-00124",
      total: 800000,
      status: "Diproses",
    },
    {
      tanggal: "2025-09-03",
      pesanan: "#ORD-00125",
      total: 500000,
      status: "Dibatalkan",
    },
  ]);

  // Data chart dari data penjualan
  const chartData = data.map((item, i) => ({
    tanggal: item.tanggal,
    total: item.total,
  }));

  const getStatusStyle = (status) => {
    if (status === "Selesai") return "bg-emerald-100 text-emerald-700";
    if (status === "Diproses") return "bg-yellow-100 text-yellow-700";
    if (status === "Dibatalkan") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Laporan Penjualan
      </h1>

      {/* Chart */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Grafik Penjualan</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tanggal" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Filter */}
      <div className="flex gap-4 mb-4">
        <input
          type="date"
          className="border p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
        />
        <input
          type="date"
          className="border p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
        />
        <button className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition">
          Filter
        </button>
      </div>

      {/* Tabel */}
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
              <th className="px-6 py-3 text-right font-semibold border-b">
                Total
              </th>
              <th className="px-6 py-3 text-left font-semibold border-b">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 border-b">{i + 1}</td>
                <td className="px-6 py-4 border-b">{row.tanggal}</td>
                <td className="px-6 py-4 border-b">{row.pesanan}</td>
                <td className="px-6 py-4 border-b text-right">
                  Rp {row.total.toLocaleString("id-ID")}
                </td>
                <td className="px-6 py-4 border-b">
                  <span
                    className={`${getStatusStyle(
                      row.status
                    )} px-3 py-1 rounded-full text-xs font-semibold`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ringkasan */}
      <div className="mt-4 text-right text-gray-700 font-medium">
        Total Pendapatan: Rp{" "}
        {data
          .reduce((acc, item) => acc + item.total, 0)
          .toLocaleString("id-ID")}
      </div>
    </div>
  );
};

export default Reports;
