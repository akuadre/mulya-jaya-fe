// src/components/Navbar.jsx

import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Clock, CalendarDays, LogOut, User, Menu } from "lucide-react";

dayjs.locale("id");

const Navbar = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(dayjs());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const dropdownRef = useRef(null);

  const user = {
    name: "Admin",
    role: "Administrator",
    avatar: "https://cdn-icons-png.freepik.com/512/9703/9703596.png",
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 🔽 Tambahkan logika sembunyi/muncul saat scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowNavbar(false); // sembunyikan saat scroll ke bawah
      } else {
        setShowNavbar(true); // tampil saat scroll ke atas
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPageTitle = (path) => {
    if (path === "/dashboard") return "Dashboard";
    const title = path.replace("/", "").replace("-", " ");
    return title.charAt(0).toUpperCase() + title.slice(1);
  };
  const pageTitle = getPageTitle(location.pathname);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  return (
    <motion.nav
      className="fixed top-0 right-0 bg-white/80 backdrop-blur-lg border-b border-gray-200 px-4 sm:px-8 py-3 flex justify-between items-center z-30 
             w-full lg:left-[264px] lg:w-[calc(100%-264px)] transition-all duration-300"
      animate={{ y: showNavbar ? 0 : -100 }}
      transition={{ type: "spring", stiffness: 80, damping: 20 }}
    >
      {/* Kiri: Judul Halaman & Tombol Hamburger */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-700 hover:text-gray-900"
          aria-label="Buka menu"
        >
          <Menu size={28} />
        </button>
        <div>
          <p className="text-sm text-gray-500">Halaman</p>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Kanan: Info & Profil Pengguna */}
      <div className="flex items-center gap-4 sm:gap-8">
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={20} />
            <span className="font-medium text-sm">
              {currentTime.format("HH:mm:ss")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <CalendarDays size={20} />
            <span className="font-medium text-sm">
              {currentTime.format("dddd, D MMMM YYYY")}
            </span>
          </div>
        </div>

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
                    <p className="text-sm font-semibold text-gray-900">
                      Masuk sebagai
                    </p>
                    <p className="text-sm text-gray-700 truncate">
                      {user.name}
                    </p>
                  </div>
                  <div className="py-1">
                    <a
                      href="#"
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors opacity-50 pointer-events-none"
                    >
                      <User size={16} className="mr-3 text-gray-500" /> Profil
                      Saya
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
