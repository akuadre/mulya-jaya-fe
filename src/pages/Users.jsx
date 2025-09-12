import { Search } from "lucide-react";

const StatusBadge = ({ status }) => {
  const styles = {
    "In progress": "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Returned: "bg-yellow-100 text-yellow-700",
    Canceled: "bg-red-100 text-red-700",
  };
  return <span className={`px-3 py-1 text-sm font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}


const Users = () => {
  return (
    <div className="p-6">
       {/* Card Container */}
      <div className="bg-white shadow-md rounded-lg p-6">
          {/* Header Tabs dan Search */}
          <div className="flex justify-between items-center mb-4 border-b pb-4">
              <div className="flex items-center space-x-1">
                  <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-100">All orders <span className="text-gray-500 ml-1">152</span></button>
                  <button className="px-4 py-2 text-sm font-semibold rounded-lg text-gray-600 hover:bg-gray-100">In progress <span className="text-gray-500 ml-1">54</span></button>
                  <button className="px-4 py-2 text-sm font-semibold rounded-lg text-gray-600 hover:bg-gray-100">Completed <span className="text-gray-500 ml-1">77</span></button>
                  <button className="px-4 py-2 text-sm font-semibold rounded-lg text-gray-600 hover:bg-gray-100">Returned <span className="text-gray-500 ml-1">15</span></button>
                  <button className="px-4 py-2 text-sm font-semibold rounded-lg text-gray-600 hover:bg-gray-100">Canceled <span className="text-gray-500 ml-1">6</span></button>
              </div>
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                  <input type="text" placeholder="Search for order..." className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:ring-2 focus:ring-blue-500 outline-none"/>
              </div>
          </div>
          
          {/* Placeholder untuk Tabel */}
          <div className="text-center py-20 bg-gray-50 rounded-lg">
             <h2 className="text-xl font-medium text-gray-600">Order Table Goes Here</h2>
             <p className="text-gray-400 mt-2">Ini adalah placeholder untuk tabel data pesanan Anda.</p>
          </div>
          {/* Contoh status badge */}
          <div className="flex space-x-4 mt-6">
              <StatusBadge status="In progress" />
              <StatusBadge status="Completed" />
              <StatusBadge status="Returned" />
              <StatusBadge status="Canceled" />
          </div>
      </div>
    </div>
  )
};

export default Users;