// src/layouts/AppLayout.jsx

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar tetap fixed */}
      <Sidebar isSidebarOpen={isSidebarOpen} />

      {/* Overlay (untuk mobile) */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          aria-hidden="true"
        ></div>
      )}

      {/* Area kanan: Navbar + Konten */}
      <div className="flex flex-col flex-1 transition-all duration-300 lg:ml-[264px]">
        {/* Navbar fixed */}
        <Navbar onMenuClick={toggleSidebar} />

        {/* Konten utama — tambahkan padding-top agar tidak ketiban navbar */}
        <main className="flex-1 overflow-y-auto p-6 pt-[88px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
