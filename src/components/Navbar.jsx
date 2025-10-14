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

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
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
      className="fixed top-0 right-0 bg-white/90 backdrop-blur-lg border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center z-40 
             w-full lg:left-64 lg:w-[calc(100%-256px)] transition-all duration-300"
      animate={{ y: showNavbar ? 0 : -100 }}
      transition={{ type: "spring", stiffness: 80, damping: 20 }}
    >
      {/* Kiri: Judul Halaman & Tombol Hamburger */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-700 hover:text-gray-900 p-1"
          aria-label="Buka menu"
        >
          <Menu size={24} />
        </button>
        <div>
          <p className="text-xs sm:text-sm text-gray-500">Halaman</p>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 truncate max-w-[150px] sm:max-w-none">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Kanan: Info & Profil Pengguna */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Info Waktu & Tanggal */}
        <div className="hidden sm:flex items-center gap-4 lg:gap-6">
          <div className="hidden md:flex items-center gap-2 text-gray-600">
            <Clock size={18} />
            <span className="font-medium text-sm">
              {currentTime.format("HH:mm:ss")}
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-2 text-gray-600">
            <CalendarDays size={18} />
            <span className="font-medium text-sm whitespace-nowrap">
              {currentTime.format("dddd, D MMMM YYYY")}
            </span>
          </div>
        </div>

        {/* Mobile Date Display */}
        <div className="sm:hidden flex items-center gap-2 text-gray-600">
          <CalendarDays size={16} />
          <span className="font-medium text-xs">
            {currentTime.format("DD/MM")}
          </span>
        </div>

        {/* Profil User */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 sm:gap-3 p-1 sm:p-1.5 rounded-full hover:bg-gray-200/60 transition-colors"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
            />
            <div className="text-left hidden sm:block">
              <p className="font-semibold text-sm text-gray-800 truncate max-w-[120px]">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate max-w-[120px]">
                {user.role}
              </p>
            </div>
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                className="origin-top-right absolute right-0 mt-3 w-56 sm:w-60 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="py-2">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-700 truncate">
                      {user.role}
                    </p>
                  </div>
                  <div className="py-1">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors opacity-50 cursor-not-allowed">
                      <User size={16} className="mr-3 text-gray-500" /> 
                      Profil Saya
                    </button>
                  </div>
                  <div className="border-t border-gray-200 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} className="mr-3" /> 
                      Keluar
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