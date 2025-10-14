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
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Overlay (untuk mobile) */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          aria-hidden="true"
        ></div>
      )}

      {/* Area kanan: Navbar + Konten */}
      <div className="flex flex-col flex-1 w-full lg:ml-[264px] lg:w-[calc(100%-264px)] min-w-0">
        {/* Navbar fixed */}
        <Navbar onMenuClick={toggleSidebar} />

        {/* Konten utama — PERBAIKAN DI SINI */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 pt-24 sm:pt-28 lg:pt-22"> {/* TAMBAH pt-nya */}
          <div className="max-w-full w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;