import { useEffect, useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler, // <-- Tambahkan Filler untuk gradient
} from "chart.js";
import { DollarSign, Package, CheckCircle, Clock } from "lucide-react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler // <-- Register Filler
);

// --- HELPER COMPONENTS (Komponen Baru untuk UI yang lebih bersih) ---

// Komponen untuk kartu statistik di bagian atas
const StatCard = ({ icon, title, value, color, loading }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-6 border-l-4" style={{ borderColor: color }}>
    {loading ? (
      <Skeleton className="w-14 h-14 rounded-full" />
    ) : (
      <div className="p-4 rounded-full" style={{ backgroundColor: `${color}20` }}>
        {icon}
      </div>
    )}
    <div>
      {loading ? (
        <>
          <Skeleton className="w-24 h-6 mb-2" />
          <Skeleton className="w-16 h-4" />
        </>
      ) : (
        <>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          <p className="text-sm font-medium text-gray-500">{title}</p>
        </>
      )}
    </div>
  </div>
);

// Komponen Skeleton untuk loading state yang elegan
const Skeleton = ({ className }) => <div className={`bg-gray-200 rounded animate-pulse ${className}`} />;

// --- MAIN DASHBOARD COMPONENT ---

const Dashboard = () => {
  // --- STATE MANAGEMENT (Disederhanakan) ---
  const [stats, setStats] = useState({ totalRevenue: 0, pending: 0, processing: 0, completed: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesData, setSalesData] = useState({ daily: {}, monthly: {}, annual: {} });
  const [loading, setLoading] = useState({ stats: true, recent: true, sales: true });
  const [salesFilter, setSalesFilter] = useState("annual");

  // --- DATA FETCHING ---
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchData = async (endpoint, key) => {
      try {
        const response = await fetch(`http://localhost:8000/api/${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(`Fetch failed for ${endpoint}`);
        const result = await response.json();

        if (key === "stats") setStats(result.data);
        if (key === "recent") setRecentOrders(result.data);
        if (key === "sales") setSalesData(result.data);

      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(prev => ({ ...prev, [key]: false }));
      }
    };

    fetchData("dashboard-stats", "stats");
    fetchData("orders-recent", "recent");
    fetchData("dashboard-sales", "sales");
  }, []);

  // --- UTILITY FUNCTIONS ---
  const formatCurrency = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  const getStatusChip = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      processing: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
    };
    const text = {
        pending: "Pending",
        processing: "Dikirim",
        completed: "Selesai",
    }
    return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{text[status]}</span>;
  };

  // --- CHART CONFIGURATION ---
  const activeSalesData = salesData[salesFilter] || { labels: [], data: [] };

  const salesChartData = {
    labels: activeSalesData.labels,
    datasets: [{
      label: "Total Penjualan",
      data: activeSalesData.data,
      borderColor: "#10B981", // Emerald-500
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, "rgba(16, 185, 129, 0.4)");
        gradient.addColorStop(1, "rgba(16, 185, 129, 0)");
        return gradient;
      },
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: "#10B981",
      pointBorderColor: "#fff",
      pointHoverRadius: 7,
    }],
  };
  
  const salesChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, ticks: { callback: (value) => formatCurrency(value) } }
    },
    interaction: { intersect: false, mode: 'index' },
  };

  const doughnutChartData = {
    labels: ["Pending", "Dikirim", "Selesai"],
    datasets: [{
      data: [stats.pending, stats.processing, stats.completed],
      backgroundColor: ["#FBBF24", "#3B82F6", "#10B981"], // Amber, Blue, Emerald
      borderColor: "#fff",
      borderWidth: 4,
      hoverOffset: 10,
    }],
  };

  // --- ANIMATION VARIANTS (Framer Motion) ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  // --- RENDER JSX ---
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* --- Header --- */}
      <motion.h1 variants={itemVariants} className="text-4xl font-bold text-gray-800 tracking-tight">
        Selamat Datang, Admin!
      </motion.h1>

      {/* --- Stat Cards Grid --- */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<DollarSign size={28} className="text-green-600" />} title="Total Pendapatan" value={formatCurrency(stats.totalRevenue)} color="#10B981" loading={loading.stats} />
        <StatCard icon={<Clock size={28} className="text-yellow-600" />} title="Pesanan Pending" value={stats.pending} color="#FBBF24" loading={loading.stats} />
        <StatCard icon={<Package size={28} className="text-blue-600" />} title="Pesanan Dikirim" value={stats.processing} color="#3B82F6" loading={loading.stats} />
        <StatCard icon={<CheckCircle size={28} className="text-emerald-600" />} title="Pesanan Selesai" value={stats.completed} color="#10B981" loading={loading.stats} />
      </motion.div>

      {/* --- Charts Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Line Chart */}
        <motion.div variants={itemVariants} className="bg-white lg:col-span-2 p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Grafik Penjualan</h3>
                <div className="flex gap-2">
                    {['annual', 'monthly', 'daily'].map(filter => (
                        <button key={filter} onClick={() => setSalesFilter(filter)}
                            className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all ${salesFilter === filter ? 'bg-emerald-500 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
            <div className="h-80">
                {loading.sales ? <Skeleton className="w-full h-full" /> : <Line data={salesChartData} options={salesChartOptions} />}
            </div>
        </motion.div>

        {/* Doughnut Chart */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Ringkasan Pesanan</h3>
            <div className="h-80 flex justify-center items-center">
                {loading.stats ? <Skeleton className="w-48 h-48 rounded-full" /> : <Doughnut data={doughnutChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />}
            </div>
        </motion.div>
      </div>

      {/* --- Recent Orders Table --- */}
      <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Pesanan Terbaru</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="border-b-2 border-gray-100">
                    <tr>
                        {['ID Pesanan', 'Pelanggan', 'Produk', 'Total', 'Status'].map(head => <th key={head} className="p-4 text-sm font-semibold text-gray-500 uppercase">{head}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {loading.recent ? (
                        [...Array(5)].map((_, i) => (
                            <tr key={i} className="border-b border-gray-100">
                                <td className="p-4"><Skeleton className="h-5 w-10" /></td>
                                <td className="p-4"><Skeleton className="h-5 w-32" /></td>
                                <td className="p-4"><Skeleton className="h-5 w-40" /></td>
                                <td className="p-4"><Skeleton className="h-5 w-24" /></td>
                                <td className="p-4"><Skeleton className="h-7 w-20 rounded-full" /></td>
                            </tr>
                        ))
                    ) : (
                        recentOrders.map(order => (
                            <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-700">#{order.id}</td>
                                <td className="p-4 text-gray-600">{order.user?.name}</td>
                                <td className="p-4 text-gray-600">{order.product?.name}</td>
                                <td className="p-4 font-semibold text-gray-800">{formatCurrency(order.total_price)}</td>
                                <td className="p-4">{getStatusChip(order.status)}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;