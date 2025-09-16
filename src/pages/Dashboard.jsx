import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // State untuk data dari API
  const [recentOrders, setRecentOrders] = useState([]);
  const [orderStats, setOrderStats] = useState({ pending: 0, processing: 0, completed: 0, cancelled: 0 });
  
  // State untuk status loading dan error
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorRecent, setErrorRecent] = useState(null);
  const [errorStats, setErrorStats] = useState(null);

  // Fungsi untuk memformat tanggal
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // useEffect untuk fetch data order terbaru
  useEffect(() => {
    const fetchRecentOrders = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) return window.location.href = "/login"; // fallback

      try {
        const response = await fetch('http://localhost:8000/api/orders-recent', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        if (!response.ok) throw new Error('Failed to fetch recent orders.');
        const result = await response.json();
        setRecentOrders(result.data);
      } catch (err) {
        setErrorRecent(err.message);
      } finally {
        setLoadingRecent(false);
      }
    };
    fetchRecentOrders();
  }, []);

  // useEffect untuk fetch data statistik order
  useEffect(() => {
    const fetchOrderStats = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) return window.location.href = "/login"; // fallback

      try {
        const response = await fetch('http://localhost:8000/api/orders-stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        if (!response.ok) throw new Error('Failed to fetch order stats.');
        const result = await response.json();
        setOrderStats(result.data);
      } catch (err) {
        setErrorStats(err.message);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchOrderStats();
  }, []);

  // Konfigurasi Chart.js
  const salesData = {
    labels: ["2021", "2022", "2023", "2024", "2025"],
    data: [120, 200, 150, 300, 250], // Data dummy, bisa diganti dengan API jika ada
  };

  const salesChartData = {
    labels: salesData.labels,
    datasets: [
      {
        label: "Penjualan",
        data: salesData.data,
        borderColor: "#0ACF83",
        backgroundColor: "rgba(10, 207, 131, 0.2)",
        borderWidth: 2,
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const salesChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
  };

  const pieChartData = {
    labels: ["Pending", "Sent", "Finish"],
    datasets: [
      {
        data: [orderStats.pending, orderStats.processing, orderStats.completed],
        backgroundColor: ["#F59E0B", "#4B5563", "#0ACF83"],
      },
    ],
  };

  const SkeletonTable = () => (
    <table className="w-full text-sm animate-pulse">
      <thead>
        <tr className="w-full text-left text-gray-500 uppercase text-sm border-b-2 border-gray-200">
          <th className="py-2 px-3 text-left w-1/6">Number</th>
          <th className="py-2 px-3 text-left w-1/6">Product</th>
          <th className="py-2 px-3 text-left w-1/6">Name</th>
          <th className="py-2 px-3 text-left w-1/6">Date</th>
          <th className="py-2 px-3 text-left w-1/6">From</th>
          <th className="py-2 px-3 text-left w-1/6">Status</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 5 }).map((_, index) => (
          <tr key={index} className="w-full border-b-2 border-gray-200">
            <td className="py-4 px-3"><div className="h-4 bg-gray-200 rounded"></div></td>
            <td className="py-4 px-3"><div className="h-4 bg-gray-200 rounded"></div></td>
            <td className="py-4 px-3"><div className="h-4 bg-gray-200 rounded"></div></td>
            <td className="py-4 px-3"><div className="h-4 bg-gray-200 rounded"></div></td>
            <td className="py-4 px-3"><div className="h-4 bg-gray-200 rounded"></div></td>
            <td className="py-4 px-3"><div className="h-4 bg-gray-200 rounded"></div></td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const SkeletonStats = () => (
    <ul className="space-y-4 animate-pulse">
      {[...Array(3)].map((_, index) => (
        <li key={index} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            <div className="h-6 w-20 bg-gray-200 rounded"></div>
          </div>
          <div className="h-8 w-10 bg-gray-200 rounded"></div>
        </li>
      ))}
    </ul>
  );

  const SkeletonChart = () => (
    <div className="flex items-center justify-center animate-pulse">
      <div className="h-64 w-64 bg-gray-200 rounded-full"></div>
    </div>
  );

  return (
    <div className="p-2">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Recent Order Table */}
        <div className="bg-white shadow rounded-lg p-6 col-span-2">
          <h3 className="font-semibold mb-4">Recent Order</h3>
          {loadingRecent ? (
            <SkeletonTable />
          ) : errorRecent ? (
            <p className="text-center text-red-500">Error: {errorRecent}</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="w-full text-left text-gray-500 uppercase text-sm border-b-2 border-gray-200">
                  <th className="py-2 px-3 text-left">Number</th>
                  <th className="py-2 px-3 text-left">Product</th>
                  <th className="py-2 px-3 text-left">Name</th>
                  <th className="py-2 px-3 text-left">Date</th>
                  <th className="py-2 px-3 text-left">From</th>
                  <th className="py-2 px-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="w-full text-left text-black text-sm border-b-2 border-gray-200"
                    >
                      <td className="py-2 px-3">{order.id}</td>
                      <td className="py-2 px-3">{order.product.name}</td>
                      <td className="py-2 px-3">{order.user.name}</td>
                      <td className="py-2 px-3">{formatDate(order.order_date)}</td>
                      <td className="py-2 px-3">{order.user.address}</td>
                      <td
                        className={`py-2 px-3 font-semibold ${
                          order.status === "pending"
                            ? "text-yellow-500"
                            : order.status === "processing"
                            ? "text-blue-500"
                            : "text-green-500"
                        }`}
                      >
                        {order.status === "processing" ? "Sent" : order.status === "completed" ? "Finish" : order.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-4 text-center text-gray-400">
                      Tidak ada order terbaru.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Total Order */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="font-semibold mb-4">Total Order</h3>
          {loadingStats ? (
            <SkeletonStats />
          ) : errorStats ? (
            <p className="text-center text-red-500">Error: {errorStats}</p>
          ) : (
            <ul className="space-y-4">
              <li className="flex items-center justify-between text-2xl">
                <div className="flex items-center space-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-yellow-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-700">Pending</span>
                </div>
                <span className="text-gray-900">{orderStats.pending}</span>
              </li>
              <li className="flex items-center justify-between text-2xl">
                <div className="flex items-center space-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 10h11l3-3m0 0l3 3m-3-3v10"
                    />
                  </svg>
                  <span className="text-gray-700">Sent</span>
                </div>
                <span className="text-gray-900">{orderStats.processing}</span>
              </li>
              <li className="flex items-center justify-between text-2xl">
                <div className="flex items-center space-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">Finish</span>
                </div>
                <span className="text-gray-900">{orderStats.completed}</span>
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Grid for Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Sales Chart */}
        <div className="bg-white shadow rounded-lg p-6 col-span-2">
          <h3 className="font-semibold mb-4">Grafik Penjualan</h3>
          {/* Skeleton for sales chart. You can add one here as well, if needed. */}
          <div className="flex justify-between items-center mb-4">
            <div id="filterButtons" className="flex items-center space-x-2 text-sm text-gray-500">
              <button
                // onClick={() => setSalesFilter("tahun")}
                className={`px-3 py-1 font-semibold rounded-full bg-[#0ACF83] text-white`}
              >
                Tahunan
              </button>
              <button
                // onClick={() => setSalesFilter("bulan")}
                className={`px-3 py-1 font-semibold rounded-full hover:bg-gray-200 text-gray-700`}
              >
                Bulanan
              </button>
              <button
                // onClick={() => setSalesFilter("hari")}
                className={`px-3 py-1 font-semibold rounded-full hover:bg-gray-200 text-gray-700`}
              >
                Harian
              </button>
            </div>
          </div>
          <Line data={salesChartData} options={salesChartOptions} />
        </div>

        {/* Pie Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="font-semibold mb-4">Total Order Pie Chart</h3>
          {loadingStats ? (
            <SkeletonChart />
          ) : errorStats ? (
            <p className="text-center text-red-500">Error: {errorStats}</p>
          ) : (
            <Pie data={pieChartData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
