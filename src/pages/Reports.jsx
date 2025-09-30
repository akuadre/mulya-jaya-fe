import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import {
  DollarSign,
  TrendingUp,
  Package,
  ShoppingCart,
  BarChart2,
  AlertTriangle,
  Award,
} from "lucide-react";

// Register Chart.js components (sudah ada di Dashboard, tapi lebih baik ada di sini juga)
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

// --- HELPER COMPONENTS ---

const ReportCard = ({ icon, title, value, color, loading }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-5">
    {loading ? (
      <div className="w-14 h-14 bg-gray-200 rounded-full animate-pulse"></div>
    ) : (
      <div className={`p-4 rounded-full ${color}`}>{icon}</div>
    )}
    <div>
      {loading ? (
        <>
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
        </>
      ) : (
        <>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          <p className="text-sm font-medium text-gray-500">{title}</p>
        </>
      )}
    </div>
  </div>
);

// --- MAIN COMPONENT ---

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("monthly"); // 'monthly', 'yearly', 'daily'

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      try {
        const response = await fetch(
          `http://localhost:8000/api/reports?period=${period}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Gagal mengambil data laporan.");
        const result = await response.json();
        setReportData(result.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [period]); // <-- Re-fetch data saat 'period' berubah

  const formatCurrency = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value || 0);

  // --- CHART CONFIGURATION ---
  const salesChartData = {
    labels: reportData?.salesOverTime?.labels || [],
    datasets: [
      {
        label: "Total Penjualan",
        data: reportData?.salesOverTime?.data || [],
        borderColor: "#10B981",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 250);
          gradient.addColorStop(0, "rgba(16, 185, 129, 0.5)");
          gradient.addColorStop(1, "rgba(16, 185, 129, 0)");
          return gradient;
        },
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#10B981",
        pointBorderColor: "#fff",
        pointHoverRadius: 8,
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const salesChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true,
        ticks: { callback: (value) => formatCurrency(value) },
      },
    },
    interaction: { intersect: false, mode: "index" },
  };

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.h1
        variants={itemVariants}
        className="text-4xl font-bold text-gray-800 tracking-tight"
      >
        Laporan Penjualan
      </motion.h1>

      {/* Summary Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <ReportCard
          icon={<DollarSign size={24} className="text-green-800" />}
          title="Total Pendapatan"
          value={formatCurrency(reportData?.summary?.totalRevenueAllTime)}
          color="bg-green-100"
          loading={loading}
        />
        <ReportCard
          icon={<TrendingUp size={24} className="text-sky-800" />}
          title="Pendapatan Tahun Ini"
          value={formatCurrency(reportData?.summary?.totalRevenueCurrentYear)}
          color="bg-sky-100"
          loading={loading}
        />
        <ReportCard
          icon={<ShoppingCart size={24} className="text-indigo-800" />}
          title="Pesanan Bulan Ini"
          value={
            loading
              ? "..."
              : `${reportData?.summary?.totalOrdersCurrentMonth} pesanan`
          }
          color="bg-indigo-100"
          loading={loading}
        />
        <ReportCard
          icon={<Package size={24} className="text-amber-800" />}
          title="Rata-rata per Pesanan"
          value={formatCurrency(reportData?.summary?.averageOrderValue)}
          color="bg-amber-100"
          loading={loading}
        />
      </motion.div>

      {/* Main Sales Chart */}
      <motion.div
        variants={itemVariants}
        className="bg-white lg:col-span-2 p-6 rounded-2xl shadow-lg"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5">
          <h3 className="text-xl font-semibold text-gray-800 mb-3 sm:mb-0">
            Grafik Performa Penjualan
          </h3>
          <div className="flex gap-2">
            {[
              { key: "daily", label: "30 Hari" },
              { key: "monthly", label: "Bulanan" },
              { key: "yearly", label: "Tahunan" },
            ].map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all ${
                  period === p.key
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className="h-96">
          {loading ? (
            <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse"></div>
          ) : (
            <Line data={salesChartData} options={salesChartOptions} />
          )}
        </div>
      </motion.div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Low Stock Products */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-red-500" size={22} />
            <h3 className="text-xl font-semibold text-gray-800">
              Produk Stok Rendah
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  {["Produk", "Stok Tersisa"].map((head) => (
                    <th
                      key={head}
                      className="p-3 text-sm font-semibold text-gray-500 uppercase"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="p-3">
                        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                      <td className="p-3">
                        <div className="h-5 w-8 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                    </tr>
                  ))
                ) : reportData?.lowStockProducts?.length > 0 ? (
                  reportData.lowStockProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 border-b border-gray-100"
                    >
                      <td className="p-3 font-medium text-gray-700">
                        {product.name}
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full text-sm">
                          {product.stock}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center p-4 text-gray-500">
                      Semua stok aman.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Best Selling Products */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <Award className="text-amber-500" size={22} />
            <h3 className="text-xl font-semibold text-gray-800">
              Produk Terlaris
            </h3>
          </div>
          <ul className="space-y-4">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <li key={i} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1.5"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </li>
              ))
            ) : reportData?.bestSellingProducts?.length > 0 ? (
              reportData.bestSellingProducts.map((item) => (
                <li key={item.id} className="flex items-center gap-4">
                  <img
                    src={
                      item.image_url
                        ? `http://localhost:8000/images/products/${item.image_url}`
                        : "https://placehold.co/100x100/e2e8f0/94a3b8?text=No+Img"
                    }
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.sales_count}x terjual
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-center p-4 text-gray-500">
                Belum ada produk yang terjual.
              </p>
            )}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Reports;
