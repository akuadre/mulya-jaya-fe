import { Home, Boxes, List, Users, BarChart2, Info } from "lucide-react";
import { NavLink } from "react-router-dom";

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

const Sidebar = ({ isSidebarOpen }) => {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-[264px] bg-slate-900 flex flex-col border-r border-slate-800 z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-4 border-b border-slate-800 shrink-0">
        <div className="bg-green-500/10 p-3 rounded-lg text-green-400">
          <img
            src="/images/mulyajaya.png"
            className="w-12"
            alt="Logo Mulya Jaya"
          />
        </div>
        <h1 className="text-xl font-bold text-slate-100 tracking-wider">
          Mulya Jaya <span className="text-green-400">Admin</span>
        </h1>
      </div>

      {/* Menu — scrollable kalau konten panjang */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        <p className="mb-2 px-2 text-xs font-bold text-slate-500 uppercase">
          Menu
        </p>
        <NavItem to="/dashboard" icon={Home}>Dashboard</NavItem>
        <NavItem to="/products" icon={Boxes}>Produk</NavItem>
        <NavItem to="/orders" icon={List}>Pesanan</NavItem>
        <NavItem to="/users" icon={Users}>Pelanggan</NavItem>
        <NavItem to="/reports" icon={BarChart2}>Laporan</NavItem>
      </nav>

      {/* Footer tetap di bawah */}
      <div className="p-4 border-t border-slate-800">
        <NavItem to="/about" icon={Info}>Tentang Aplikasi</NavItem>
      </div>
    </aside>
  );
};

export default Sidebar;
