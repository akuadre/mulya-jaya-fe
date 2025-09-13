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
  // Dummy data for recent orders
  const recentOrders = [
    {
      number: "MJ001",
      product: "Dior",
      name: "Jonathan",
      date: "23/08/2025",
      from: "Grozjnan",
      status: "Pending",
    },
    {
      number: "MJ002",
      product: "Ray-Ban",
      name: "Maria",
      date: "24/08/2025",
      from: "Jakarta",
      status: "Sent",
    },
    {
      number: "MJ003",
      product: "Oakley",
      name: "Budi",
      date: "25/08/2025",
      from: "Surabaya",
      status: "Finish",
    },
  ];

  // Dummy data for order stats
  const orderStats = {
    pending: 10,
    sent: 30,
    finish: 100,
  };

  // State for the sales chart filter
  const [salesFilter, setSalesFilter] = useState("tahun");
  const salesData = {
    tahun: {
      labels: ["2021", "2022", "2023", "2024", "2025"],
      data: [120, 200, 150, 300, 250],
    },
    bulan: {
      labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
      data: [20, 35, 40, 55, 30, 70],
    },
    hari: {
      labels: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"],
      data: [5, 10, 8, 12, 7],
    },
  };

  const salesChartData = {
    labels: salesData[salesFilter].labels,
    datasets: [
      {
        label: "Penjualan",
        data: salesData[salesFilter].data,
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
      legend: {
        display: false,
      },
    },
  };

  const pieChartData = {
    labels: ["Pending", "Sent", "Finish"],
    datasets: [
      {
        data: [orderStats.pending, orderStats.sent, orderStats.finish],
        backgroundColor: ["#F59E0B", "#4B5563", "#0ACF83"], // Warna sesuai Tailwind: yellow-500, gray-700, hijau
      },
    ],
  };

  return (
    <div className="p-2">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Recent Order */}
        <div className="bg-white shadow rounded-lg p-6 col-span-2">
          <h3 className="font-semibold mb-4">Recent Order</h3>
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
              {recentOrders.map((order, index) => (
                <tr
                  key={index}
                  className="w-full text-left text-black text-sm border-b-2 border-gray-200"
                >
                  <td className="py-2 px-3">{order.number}</td>
                  <td className="py-2 px-3">{order.product}</td>
                  <td className="py-2 px-3">{order.name}</td>
                  <td className="py-2 px-3">{order.date}</td>
                  <td className="py-2 px-3">{order.from}</td>
                  <td
                    className={`py-2 px-3 font-semibold ${
                      order.status === "Pending"
                        ? "text-[#F59E0B]"
                        : order.status === "Sent"
                        ? "text-blue-500"
                        : "text-[#0ACF83]"
                    }`}
                  >
                    {order.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Order */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="font-semibold mb-4">Total Order</h3>
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
              <span className="text-gray-900">{orderStats.sent}</span>
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
              <span className="text-gray-900">{orderStats.finish}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Grid for Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Sales Chart */}
        <div className="bg-white shadow rounded-lg p-6 col-span-2">
          <h3 className="font-semibold mb-4">Grafik Penjualan</h3>
          <div className="flex justify-between items-center mb-4">
            <div id="filterButtons" className="flex items-center space-x-2 text-sm text-gray-500">
              <button
                onClick={() => setSalesFilter("tahun")}
                className={`px-3 py-1 font-semibold rounded-full ${
                  salesFilter === "tahun" ? "bg-[#0ACF83] text-white" : "hover:bg-gray-200 text-gray-700"
                }`}
              >
                Tahunan
              </button>
              <button
                onClick={() => setSalesFilter("bulan")}
                className={`px-3 py-1 font-semibold rounded-full ${
                  salesFilter === "bulan" ? "bg-[#0ACF83] text-white" : "hover:bg-gray-200 text-gray-700"
                }`}
              >
                Bulanan
              </button>
              <button
                onClick={() => setSalesFilter("hari")}
                className={`px-3 py-1 font-semibold rounded-full ${
                  salesFilter === "hari" ? "bg-[#0ACF83] text-white" : "hover:bg-gray-200 text-gray-700"
                }`}
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
          <Pie data={pieChartData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;