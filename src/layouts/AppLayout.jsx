import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Container untuk Sidebar yang tidak berubah */}
      <div className="w-64">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar kini memiliki posisi sticky */}
        <Navbar />

        {/* Page content */}
        <main className="flex-1 p-6">
          <div className="bg-white/20 shadow-lg rounded-lg p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;