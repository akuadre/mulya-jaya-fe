import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import "dayjs/locale/id"; // Import locale Indonesia
import { Search, Bell } from "lucide-react";

// Konfigurasi Day.js untuk menggunakan locale Indonesia
dayjs.locale("id");

// Komponen kecil untuk jam digital
const LiveClock = () => {
  const [time, setTime] = useState(dayjs());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(dayjs());
    }, 1000);

    // Cleanup interval saat komponen di-unmount
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center">
      <p className="font-semibold text-gray-800 text-lg">
        {time.format("HH:mm:ss")}
      </p>
      <p className="text-xs text-gray-500">{time.format("dddd, D MMMM YYYY")}</p>
    </div>
  );
};

const Navbar = () => {
  const location = useLocation();

  // Fungsi untuk membuat judul dari path URL
  const getPageTitle = (path) => {
    if (path === "/dashboard") return "Dashboard";
    const title = path.replace("/", "").replace("-", " ");
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    // Gunakan motion.nav untuk animasi
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.2 }}
      // Posisi Navbar disesuaikan dengan lebar Sidebar (w-64 -> 16rem)
      className="bg-white/80 backdrop-blur-lg border-b border-gray-200 px-8 py-3 flex justify-between items-center sticky top-0 z-40 ml-64 w-[calc(100%-16rem)]"
    >
      {/* Kiri: Breadcrumbs */}
      <div>
        <p className="text-sm text-gray-500">Halaman</p>
        <h1 className="text-2xl font-bold text-gray-800">{pageTitle}</h1>
      </div>

      {/* Kanan: Aksi & User */}
      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Cari sesuatu..."
            className="bg-gray-100 border border-gray-200 rounded-full w-64 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
          />
        </div>

        {/* Jam & Tanggal */}
        <LiveClock />

        {/* Tombol Notifikasi */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <Bell className="text-gray-600" size={22} />
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default Navbar;