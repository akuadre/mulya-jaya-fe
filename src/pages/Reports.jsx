import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Reports = () => {
  const yearlyData = [
    { year: "2016", total: 10000 },
    { year: "2017", total: 22000 },
    { year: "2018", total: 18000 },
    { year: "2019", total: 35000 },
    { year: "2020", total: 25000 },
    { year: "2021", total: 30000 },
  ];

  const monthlyData = [
    { month: "1", total: 12000 },
    { month: "2", total: 20000 },
    { month: "3", total: 28000 },
    { month: "4", total: 22000 },
    { month: "5", total: 21000 },
    { month: "6", total: 34000 },
  ];

  const stok = [
    { id: 1, name: "Dior", price: 2000000, stok: 2 },
    { id: 2, name: "Dior", price: 2000000, stok: 3 },
    { id: 3, name: "Dior", price: 2000000, stok: 5 },
    { id: 4, name: "Dior", price: 2000000, stok: 5 },
    { id: 5, name: "Dior", price: 2000000, stok: 6 },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Report</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-6 flex items-center space-x-4">
          <div className="bg-emerald-100 text-emerald-600 p-3 rounded-full">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Total pemasukan (tahun)</div>
            <div className="text-xl font-semibold">IDR 250.000.000</div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 flex items-center space-x-4">
          <div className="bg-pink-100 text-pink-600 p-3 rounded-full">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Total pemasukan (bulan)</div>
            <div className="text-xl font-semibold">IDR 5.000.000</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="font-semibold mb-4">Pendapatan (Tahun)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`} />
              <Line type="monotone" dataKey="total" stroke="#fbbf24" strokeWidth={3} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="font-semibold mb-4">Pendapatan (Bulan)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`} />
              <Line type="monotone" dataKey="total" stroke="#34d399" strokeWidth={3} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stok */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="font-semibold mb-4">Stok</h3>
        <table className="w-full text-sm text-gray-700 border-collapse">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="py-2 text-left">No</th>
              <th className="py-2 text-left">Name</th>
              <th className="py-2 text-left">Price</th>
              <th className="py-2 text-left">Stok</th>
            </tr>
          </thead>
          <tbody>
            {stok.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="py-2">{String(i + 1).padStart(2, "0")}.</td>
                <td>{item.name}</td>
                <td>Rp {item.price.toLocaleString("id-ID")}</td>
                <td className={`font-semibold ${item.stok <= 3 ? "text-red-500" : ""}`}>
                  {item.stok}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
