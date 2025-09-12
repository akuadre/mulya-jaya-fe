import { Filter, Upload } from 'lucide-react';

const NiceHeader = () => {
  return (
    <header className="bg-gray-50/95 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Title */}
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-sm text-gray-500">152 orders found</p>
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2.5 text-sm font-medium border bg-white rounded-lg shadow-sm hover:bg-gray-50">
            <Filter className="w-4 h-4 text-gray-600"/>
            <span>Filters</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2.5 text-sm font-medium border bg-white rounded-lg shadow-sm hover:bg-gray-50">
            <Upload className="w-4 h-4 text-gray-600"/>
            <span>Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default NiceHeader;