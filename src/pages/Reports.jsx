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
  Download,
} from "lucide-react";
import axiosClient from "../lib/axiosClient";

// Import library untuk export Excel
import * as XLSX from "xlsx";

// Register Chart.js components
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
  <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg flex items-center gap-4 sm:gap-5 w-full">
    {loading ? (
      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
    ) : (
      <div className={`p-3 sm:p-4 rounded-full ${color} flex-shrink-0`}>
        {icon}
      </div>
    )}
    <div className="min-w-0 flex-1">
      {loading ? (
        <>
          <div className="w-24 sm:w-32 h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="w-16 sm:w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
        </>
      ) : (
        <>
          <p className="text-xl sm:text-2xl font-bold text-gray-800 truncate">
            {value}
          </p>
          <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">
            {title}
          </p>
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
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response = await axiosClient.get(`/api/reports`, {
          params: { period },
        });

        const result = response.data;
        if (result.success) {
          setReportData(result.data);
        } else {
          throw new Error(result.message || "Gagal mengambil data laporan.");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [period]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value || 0);

  // --- FUNGSI EXPORT EXCEL ---
  const exportToExcel = () => {
    setExportLoading(true);

    try {
      const wb = XLSX.utils.book_new();

      // === SUMMARY SHEET ===
      const summaryData = [
        ["LAPORAN PENJUALAN", ""],
        ["", ""],
        [
          "Total Pendapatan Keseluruhan",
          reportData?.summary?.totalRevenueAllTime || 0,
        ],
        [
          "Pendapatan Bulan Ini",
          reportData?.summary?.totalRevenueCurrentMonth || 0,
        ],
        [
          "Total Pesanan Tahun Ini",
          reportData?.summary?.totalOrdersCurrentYear || 0,
        ],
        [
          "Total Pesanan Bulan Ini",
          reportData?.summary?.totalOrdersCurrentMonth || 0,
        ],
        ["", ""],
        ["Tanggal Export", new Date().toLocaleDateString("id-ID")],
        [
          "Periode",
          period === "daily"
            ? "30 Hari Terakhir"
            : period === "monthly"
            ? "Bulanan"
            : "Tahunan",
        ],
      ];
      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);

      // Merge judul
      wsSummary["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];

      // Auto width kolom
      wsSummary["!cols"] = [{ wch: 30 }, { wch: 25 }];

      XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

      // === SALES SHEET ===
      if (reportData?.salesOverTime) {
        const salesData = [
          ["Periode", "Total Penjualan"],
          ...reportData.salesOverTime.labels.map((label, index) => [
            label,
            reportData.salesOverTime.data[index] || 0,
          ]),
        ];
        const wsSales = XLSX.utils.aoa_to_sheet(salesData);
        wsSales["!cols"] = [{ wch: 25 }, { wch: 20 }];
        XLSX.utils.book_append_sheet(wb, wsSales, "Trend Penjualan");
      }

      // === LOW STOCK ===
      if (reportData?.lowStockProducts?.length > 0) {
        const lowStockData = [
          ["Nama Produk", "Stok Tersisa"],
          ...reportData.lowStockProducts.map((product) => [
            product.name,
            product.stock,
          ]),
        ];
        const wsLowStock = XLSX.utils.aoa_to_sheet(lowStockData);
        wsLowStock["!cols"] = [{ wch: 30 }, { wch: 15 }];
        XLSX.utils.book_append_sheet(wb, wsLowStock, "Stok Rendah");
      }

      // === BEST SELLING ===
      if (reportData?.bestSellingProducts?.length > 0) {
        const bestSellingData = [
          ["Nama Produk", "Jumlah Terjual"],
          ...reportData.bestSellingProducts.map((product) => [
            product.name,
            product.sales_count,
          ]),
        ];
        const wsBestSelling = XLSX.utils.aoa_to_sheet(bestSellingData);
        wsBestSelling["!cols"] = [{ wch: 30 }, { wch: 15 }];
        XLSX.utils.book_append_sheet(wb, wsBestSelling, "Produk Terlaris");
      }

      // Export file
      const fileName = `laporan_penjualan_${period}_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error("Export error:", error);
      alert("Gagal mengexport data ke Excel");
    } finally {
      setExportLoading(false);
    }
  };

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
      x: {
        grid: { display: false },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
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
      className="space-y-6 w-full min-w-0 p-2"
    >
      {/* Header dengan Tombol Export */}
      <motion.div variants={itemVariants} className="w-full min-w-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 tracking-tight">
              Laporan Penjualan
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Analisis lengkap performa penjualan dan inventori
            </p>
          </div>

          {/* Tombol Export Excel */}
          <button
            onClick={exportToExcel}
            disabled={exportLoading || loading || !reportData}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200 whitespace-nowrap"
          >
            {exportLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download size={18} />
                <span>Export Excel</span>
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 w-full min-w-0"
      >
        <ReportCard
          icon={
            <DollarSign size={20} className="text-green-800 sm:w-6 sm:h-6" />
          }
          title="Total Pendapatan"
          value={formatCurrency(reportData?.summary?.totalRevenueAllTime)}
          color="bg-green-100"
          loading={loading}
        />
        <ReportCard
          icon={<TrendingUp size={20} className="text-sky-800 sm:w-6 sm:h-6" />}
          title="Pendapatan Bulan Ini"
          value={formatCurrency(reportData?.summary?.totalRevenueCurrentMonth)}
          color="bg-sky-100"
          loading={loading}
        />
        <ReportCard
          icon={
            <ShoppingCart size={20} className="text-indigo-800 sm:w-6 sm:h-6" />
          }
          title="Pesanan Tahun Ini"
          value={
            loading
              ? "..."
              : `${reportData?.summary?.totalOrdersCurrentYear} pesanan`
          }
          color="bg-indigo-100"
          loading={loading}
        />
        <ReportCard
          icon={<Package size={20} className="text-amber-800 sm:w-6 sm:h-6" />}
          title="Pesanan Bulan Ini"
          value={
            loading
              ? "..."
              : `${reportData?.summary?.totalOrdersCurrentMonth} pesanan`
          }
          color="bg-amber-100"
          loading={loading}
        />
      </motion.div>

      {/* Main Sales Chart */}
      <motion.div
        variants={itemVariants}
        className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg w-full min-w-0"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
            Grafik Performa Penjualan
          </h3>
          <div className="flex gap-2 flex-wrap">
            {[
              { key: "daily", label: "30 Hari" },
              { key: "monthly", label: "Bulanan" },
              { key: "yearly", label: "Tahunan" },
            ].map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all whitespace-nowrap ${
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
        <div className="h-64 sm:h-80 lg:h-96">
          {loading ? (
            <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse"></div>
          ) : (
            <Line data={salesChartData} options={salesChartOptions} />
          )}
        </div>
      </motion.div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full min-w-0">
        {/* Low Stock Products */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl shadow-lg w-full min-w-0"
        >
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-red-500 w-5 h-5 sm:w-6 sm:h-6" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
              Produk Stok Rendah
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px] text-left">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  {["Produk", "Stok Tersisa"].map((head) => (
                    <th
                      key={head}
                      className="p-3 text-xs sm:text-sm font-semibold text-gray-500 uppercase whitespace-nowrap"
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
                      <td className="p-3 font-medium text-gray-700 max-w-[200px] truncate">
                        {product.name}
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs sm:text-sm">
                          {product.stock}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="2"
                      className="text-center p-4 text-gray-500 text-sm sm:text-base"
                    >
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
          className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg w-full min-w-0"
        >
          <div className="flex items-center gap-3 mb-4">
            <Award className="text-amber-500 w-5 h-5 sm:w-6 sm:h-6" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
              Produk Terlaris
            </h3>
          </div>
          <ul className="space-y-3 sm:space-y-4">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <li key={i} className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1.5"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </li>
              ))
            ) : reportData?.bestSellingProducts?.length > 0 ? (
              reportData.bestSellingProducts.map((item) => (
                <li key={item.id} className="flex items-center gap-3 sm:gap-4">
                  <img
                    src={
                      item.image_url
                        ? `${import.meta.env.VITE_API_URL}/images/products/${
                            item.image_url
                          }`
                        : "https://placehold.co/100x100/e2e8f0/94a3b8?text=No+Img"
                    }
                    alt={item.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                      {item.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {item.sales_count}x terjual
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-center p-4 text-gray-500 text-sm sm:text-base">
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
