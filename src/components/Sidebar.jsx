import {
  Home,
  Boxes,
  List,
  Users,
  BarChart2,
  LogOut,
  Package, // Ikon baru untuk logo
} from "lucide-react";
import { NavLink } from "react-router-dom";

// Komponen NavItem yang sudah disempurnakan
const NavItem = ({ to, icon: Icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-gradient-to-r from-green-500/20 to-slate-800/5 text-white font-semibold border-l-4 border-green-500"
          : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
      }`
    }
  >
    <Icon className="w-5 h-5" />
    <span>{children}</span>
  </NavLink>
);

const Sidebar = () => {
  const handleLogout = () => {
    // Logika logout sederhana, hapus token dan redirect
    localStorage.removeItem("adminToken");
    window.location.href = "/login";
  };

  return (
    <aside className="w-64 bg-slate-900 flex flex-col h-screen fixed top-0 left-0 border-r border-slate-800">
      {/* --- Logo --- */}
      <div className="p-6 flex items-center gap-4 border-b border-slate-800">
        <div className="bg-green-500/10 p-3 rounded-lg text-green-400">
          {/* <Package size={28} /> */}
          <img src="/images/mulyajaya.png" className="w-12"/>
        </div>
        <h1 className="text-xl font-bold text-slate-100 tracking-wider">
          Mulya Jaya <span className="text-green-400">Admin</span>
        </h1>
      </div>

      {/* --- Menu --- */}
      <nav className="mt-6 flex-1 px-4 space-y-2">
        <p className="mb-2 px-2 text-xs font-bold text-slate-500 uppercase">
          Menu
        </p>
        <NavItem to="/dashboard" icon={Home}>
          Dashboard
        </NavItem>
        <NavItem to="/products" icon={Boxes}>
          Produk
        </NavItem>
        <NavItem to="/orders" icon={List}>
          Pesanan
        </NavItem>
        <NavItem to="/users" icon={Users}>
          Pelanggan
        </NavItem>
        <NavItem to="/reports" icon={BarChart2}>
          Laporan
        </NavItem>
      </nav>

      {/* --- User Section --- */}
      <div className="p-4 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="https://cdn-icons-png.freepik.com/512/9703/9703596.png"
            alt="User Avatar"
            className="w-10 h-10 rounded-full ring-2 ring-slate-700"
          />
          <div>
            <p className="font-semibold text-slate-100">Admin</p>
            <p className="text-xs text-slate-400">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          title="Logout"
          className="text-slate-500 hover:text-red-400 transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;