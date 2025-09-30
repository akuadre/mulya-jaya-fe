import {
  Home,
  Boxes,
  List,
  Users,
  BarChart2,
  Info, // <-- Ikon baru ditambahkan
} from "lucide-react";
import { NavLink } from "react-router-dom";

// Komponen NavItem tetap sama (tidak diubah)
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
  // handleLogout dihapus dari sini

  return (
    <aside className="w-[264px] bg-slate-900 flex flex-col h-screen fixed top-0 left-0 border-r border-slate-800">
      {/* --- Logo (Tidak diubah) --- */}
      <div className="p-6 flex items-center gap-4 border-b border-slate-800">
        <div className="bg-green-500/10 p-3 rounded-lg text-green-400">
          <img src="/images/mulyajaya.png" className="w-12" alt="Logo Mulya Jaya"/>
        </div>
        <h1 className="text-xl font-bold text-slate-100 tracking-wider">
          Mulya Jaya <span className="text-green-400">Admin</span>
        </h1>
      </div>

      {/* --- Menu (Tidak diubah) --- */}
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

      {/* --- Bagian User Dihapus dan Diganti Footer --- */}
      <div className="p-4 mt-auto border-t border-slate-800">
        <NavItem to="/about" icon={Info}>
            Tentang Aplikasi
        </NavItem>
      </div>
    </aside>
  );
};

export default Sidebar;