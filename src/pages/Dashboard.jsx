import { useEffect, useState } from "react";
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
    // --- STATE DATA ---
    const [recentOrders, setRecentOrders] = useState([]);
    const [orderStats, setOrderStats] = useState({ pending: 0, processing: 0, completed: 0, cancelled: 0 });

    const [monthlySales, setMonthlySales] = useState({ labels: [], data: [] });
    // Ubah nama state dari annualOrders menjadi annualSales agar lebih sesuai
    const [annualSales, setAnnualSales] = useState({ labels: [], data: [] }); 
    const [dailySales, setDailySales] = useState({ labels: [], data: [] }); 

    // --- STATE LOADING & ERROR ---
    const [loadingMonthly, setLoadingMonthly] = useState(true);
    const [errorMonthly, setErrorMonthly] = useState(null);
    const [loadingAnnual, setLoadingAnnual] = useState(true);
    const [loadingDaily, setLoadingDaily] = useState(true); 
    const [errorDaily, setErrorDaily] = useState(null); 
    const [loadingRecent, setLoadingRecent] = useState(true);
    const [loadingStats, setLoadingStats] = useState(true);
    const [errorRecent, setErrorRecent] = useState(null);
    const [errorStats, setErrorStats] = useState(null);

    const [salesFilter, setSalesFilter] = useState("tahunan"); 
    
    // Fungsi untuk memformat tanggal
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };
    
    // Fungsi untuk memformat mata uang (IDR) tanpa desimal
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            // Memastikan tidak ada desimal (misalnya: 5.5)
            minimumFractionDigits: 0
        }).format(value);
    };

    // --- FETCH DATA API ---

    const fetchData = async (endpoint, setter, loadingSetter, errorSetter, isStatOrRecent = false) => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            if (endpoint === 'orders-recent') return window.location.href = "/login";
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/${endpoint}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error(`Failed to fetch ${endpoint}.`);
            const result = await response.json();

            if (isStatOrRecent) {
                setter(result.data);
            } else {
                setter({ labels: result.labels, data: result.data }); 
            }
        } catch (err) {
            if (errorSetter) errorSetter(err.message);
        } finally {
            loadingSetter(false);
        }
    };

    useEffect(() => {
        fetchData('orders-recent', setRecentOrders, setLoadingRecent, setErrorRecent, true);
        fetchData('orders-stats', setOrderStats, setLoadingStats, setErrorStats, true);
        fetchData('orders-sales-monthly', setMonthlySales, setLoadingMonthly, setErrorMonthly);
        // >>> PERUBAHAN 1: Ganti endpoint menjadi orders-sales-annual dan ganti setter ke setAnnualSales
        fetchData('orders-sales-annual', setAnnualSales, setLoadingAnnual); 
        fetchData('orders-sales-daily', setDailySales, setLoadingDaily, setErrorDaily); 
    }, []);


    // --- KONFIGURASI CHART.JS DINAMIS ---

    const activeChartData = salesFilter === 'tahunan'
        // >>> PERUBAHAN 2: Gunakan state annualSales
        ? annualSales
        : salesFilter === 'bulanan'
        ? monthlySales
        : dailySales; 

    // >>> PERUBAHAN 3: Ubah label untuk filter tahunan menjadi Penjualan Tahunan
    const chartLabel = salesFilter === 'tahunan' ? "Total Penjualan Tahunan" : 
                       salesFilter === 'bulanan' ? "Penjualan Bulanan" : 
                       "Penjualan Harian (7 Hari Terakhir)";
    
    const chartLoading = salesFilter === 'tahunan' ? loadingAnnual : 
                         salesFilter === 'bulanan' ? loadingMonthly : loadingDaily; 

    const chartError = salesFilter === 'tahunan' ? null : 
                       salesFilter === 'bulanan' ? errorMonthly : errorDaily; 
    
    const isChartDataEmpty = (activeChartData.data.length > 0 && activeChartData.data.every(d => d === 0) && !chartLoading && !chartError);


    const salesChartData = {
        labels: activeChartData.labels, 
        datasets: [
            {
                // >>> PERUBAHAN 4: Label dataset selalu Total Sales/Keuntungan karena semua menampilkan Rupiah
                label: "Total Penjualan", 
                data: activeChartData.data, 
                borderColor: "#0ACF83",
                backgroundColor: "rgba(10, 207, 131, 0.2)",
                borderWidth: 2,
                fill: true,
                tension: 0.3,
            },
        ],
    };

    // Konfigurasi Chart Options
    const salesChartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) label += ': ';
                        
                        // >>> PERUBAHAN 5: Hapus kondisi if/else. Semua filter (tahunan, bulanan, harian) kini menggunakan formatCurrency.
                        label += formatCurrency(context.parsed.y);
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true, 
                ticks: {
                    callback: function(value) {
                        // >>> PERUBAHAN 6: Semua sumbu Y menggunakan formatCurrency
                        return formatCurrency(value);
                    }
                }
            }
        }
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
    
    const getStatusText = (status) => {
        return status === "processing" ? "Sent" : status === "completed" ? "Finish" : "Pending";
    }

    const getStatusClass = (status) => {
        return status === "pending" ? "text-yellow-500" : status === "processing" ? "text-blue-500" : "text-green-500";
    }

    // --- RENDER KOMPONEN (JSX) ---

    return (
        <div className="p-2">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Recent Order Table */}
                <div className="bg-white shadow rounded-lg p-6 col-span-2">
                    <h3 className="font-semibold mb-4">Recent Order</h3>
                    {loadingRecent ? (
                        <p className="text-center text-gray-500 py-6">Loading recent orders...</p>
                    ) : errorRecent ? (
                        <p className="text-center text-red-500">Error: {errorRecent}</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="w-full text-left text-gray-500 uppercase text-sm border-b-2 border-gray-200">
                                    <th className="py-2 px-3 text-left">No</th>
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
                                        <tr key={order.id} className="w-full text-left text-black text-sm border-b-2 border-gray-200">
                                            <td className="py-2 px-3">{order.id}</td>
                                            <td className="py-2 px-3">{order.product?.name}</td>
                                            <td className="py-2 px-3">{order.user?.name}</td>
                                            <td className="py-2 px-3">{formatDate(order.order_date)}</td>
                                            <td className="py-2 px-3">{order.user?.address}</td>
                                            <td className={`py-2 px-3 font-semibold ${getStatusClass(order.status)}`}>
                                                {getStatusText(order.status)}
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

                {/* Total Order (Stats) */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="font-semibold mb-4">Total Order</h3>
                    {loadingStats ? (
                        <p className="text-center text-gray-500 py-6">Loading stats...</p>
                    ) : errorStats ? (
                        <p className="text-center text-red-500">Error: {errorStats}</p>
                    ) : (
                        <ul className="space-y-4">
                            <li className="flex items-center justify-between text-2xl">
                                <div className="flex items-center space-x-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    <span className="text-gray-700">Pending</span>
                                </div>
                                <span className="text-gray-900">{orderStats.pending}</span>
                            </li>
                            <li className="flex items-center justify-between text-2xl">
                                <div className="flex items-center space-x-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h11l3-3m0 0l3 3m-3-3v10"/></svg>
                                    <span className="text-gray-700">Sent</span>
                                </div>
                                <span className="text-gray-900">{orderStats.processing}</span>
                            </li>
                            <li className="flex items-center justify-between text-2xl">
                                <div className="flex items-center space-x-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
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
                {/* Sales Chart (Line Chart) */}
                <div className="bg-white shadow rounded-lg p-6 col-span-2">
                    <h3 className="font-semibold mb-4">Grafik {chartLabel}</h3> 
                    
                    {/* Filter Buttons */}
                    <div className="flex justify-between items-center mb-4">
                        <div id="filterButtons" className="flex items-center space-x-2 text-sm text-gray-500">
                            {/* Tombol Tahunan */}
                            <button
                                onClick={() => setSalesFilter("tahunan")}
                                className={`px-3 py-1 font-semibold rounded-full transition-colors duration-200 ${
                                    salesFilter === "tahunan" 
                                    ? "bg-[#0ACF83] text-white" 
                                    : "hover:bg-gray-200 text-gray-700"
                                }`}
                            >
                                Tahunan
                            </button>
                            {/* Tombol Bulanan */}
                            <button
                                onClick={() => setSalesFilter("bulanan")}
                                className={`px-3 py-1 font-semibold rounded-full transition-colors duration-200 ${
                                    salesFilter === "bulanan" 
                                    ? "bg-[#0ACF83] text-white" 
                                    : "hover:bg-gray-200 text-gray-700"
                                }`}
                            >
                                Bulanan
                            </button>
                            {/* Tombol Harian */}
                            <button
                                onClick={() => setSalesFilter("harian")}
                                className={`px-3 py-1 font-semibold rounded-full transition-colors duration-200 ${
                                    salesFilter === "harian" 
                                    ? "bg-[#0ACF83] text-white" 
                                    : "hover:bg-gray-200 text-gray-700"
                                }`}
                            >
                                Harian
                            </button>
                        </div>
                    </div>
                    
                    {/* Render Line Chart dengan Loading/Error Dinamis */}
                    {chartLoading ? (
                        <div className="flex justify-center items-center h-64">
                             <p className="text-gray-500">Loading data {salesFilter}...</p>
                        </div>
                    ) : chartError ? (
                        <div className="text-center text-red-500 h-64 flex items-center justify-center">
                            <p>Error: Gagal memuat data penjualan {salesFilter}. ({chartError})</p>
                        </div>
                    ) : isChartDataEmpty ? (
                           <div className="text-center text-gray-500 h-64 flex items-center justify-center">
                                <p className="text-lg font-semibold text-gray-600">
                                    Belum ada data penjualan yang berhasil diselesaikan.
                                </p>
                            </div>
                    ) : (
                        <Line data={salesChartData} options={salesChartOptions} />
                    )}
                </div>

                {/* Pie Chart */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="font-semibold mb-4">Total Order Pie Chart</h3>
                    {loadingStats ? (
                        <p className="text-center text-gray-500 py-6">Loading chart...</p>
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