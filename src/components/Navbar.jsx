import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Clock, CalendarDays, LogOut, User, Settings } from "lucide-react";

dayjs.locale("id");

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State untuk jam, tanggal, dan dropdown
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Data user (bisa diganti dengan data dari state/context nantinya)
  const user = {
    name: "Admin",
    role: "Administrator",
    avatar: "https://cdn-icons-png.freepik.com/512/9703/9703596.png",
  };

  // Efek untuk update jam setiap detik
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Efek untuk menutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fungsi untuk mendapatkan judul halaman dari URL
  const getPageTitle = (path) => {
    if (path === "/dashboard") return "Dashboard";
    const title = path.replace("/", "").replace("-", " ");
    return title.charAt(0).toUpperCase() + title.slice(1);
  };
  const pageTitle = getPageTitle(location.pathname);
  
  // Fungsi Logout
  const handleLogout = () => {
    setIsDropdownOpen(false);
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  return (
    <motion.nav
      className="bg-white/80 backdrop-blur-lg border-b border-gray-200 px-8 py-3 flex justify-between items-center sticky top-0 z-40 w-full"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      {/* Kiri: Judul Halaman */}
      <div>
        <p className="text-sm text-gray-500">Halaman</p>
        <h1 className="text-2xl font-bold text-gray-800">{pageTitle}</h1>
      </div>

      {/* Kanan: Info & Profil Pengguna */}
      <div className="flex items-center gap-8">
        {/* Bagian baru: Jam & Tanggal */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={20} />
            <span className="font-medium text-sm">{currentTime.format("HH:mm:ss")}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <CalendarDays size={20} />
            <span className="font-medium text-sm">{currentTime.format("dddd, D MMMM YYYY")}</span>
          </div>
        </div>

        {/* Bagian baru: Profil Pengguna & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-1.5 rounded-full hover:bg-gray-200/60 transition-colors"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-left hidden sm:block">
              <p className="font-semibold text-sm text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                className="origin-top-right absolute right-0 mt-3 w-60 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="py-2">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">Masuk sebagai</p>
                    <p className="text-sm text-gray-700 truncate">{user.name}</p>
                  </div>
                  <div className="py-1">
                    {/* Link ini bisa diaktifkan nanti jika halaman profil sudah ada */}
                    <a href="#" className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors opacity-50 pointer-events-none">
                      <User size={16} className="mr-3 text-gray-500" /> Profil Saya
                    </a>
                  </div>
                  <div className="border-t border-gray-200 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} className="mr-3" /> Keluar
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;