import {
  Home,
  Boxes,
  List,
  Users,
  BarChart2,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import axios from "axios";

const handleLogout = async () => {
  const token = localStorage.getItem("adminToken");

  if (!token) return window.location.href = "/login"; // fallback

  try {
    await axios.post(
      "http://localhost:8000/api/admin/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (err) {
    console.error("Logout gagal:", err.response?.data || err.message);
  } finally {
    // Hapus token dari localStorage & redirect
    localStorage.removeItem("adminToken");
    window.location.href = "/login";
  }
};

const NavItem = ({ to, icon: Icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
        // isActive ? "bg-green-600/75 text-white" : "text-gray-500 hover:bg-gray-100"
        isActive ? "bg-green-500/20 text-green-700" : "text-gray-500 hover:bg-gray-100"
      }`
    }
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{children}</span>
  </NavLink>
);

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md flex flex-col h-screen fixed top-0 left-0">
      {/* Logo */}
      <div className="p-6 flex items-center">
        {/* <span className="w-3 h-3 bg-emerald-500 rounded-full mr-1.5"></span> */}
        <img
          src="images/mulyajaya.png"
          alt="Mulya Jaya Icon"
          className="w-10 h-10 rounded-full border-4 border-green-400 mr-1.5"
        />
        <h1 className="text-2xl font-bold text-gray-800">Mulya</h1>
        <h1 className="text-2xl font-bold text-green-600">Admin</h1>
      </div>

      {/* Menu */}
      <nav className="mt-2 flex-1 px-4 space-y-1">
        <p className="mb-2 px-4 py-2 text-xs font-semibold text-gray-400 uppercase border-b border-gray-300">
          <span>Marketing</span>
        </p>
        <NavItem to="/dashboard" icon={Home}>
          Dashboard
        </NavItem>
        <NavItem to="/products" icon={Boxes}>
          Manage products
        </NavItem>
        <NavItem to="/orders" icon={List}>
          Manage order
        </NavItem>
        <NavItem to="/users" icon={Users}>
          Manage user
        </NavItem>
        <NavItem to="/reports" icon={BarChart2}>
          Report
        </NavItem>
      </nav>

      {/* Dark mode toggle */}
      {/* <div className="p-4 border-t">
        <div className="flex justify-between items-center p-2 rounded-lg bg-gray-100">
          <span className="font-medium text-gray-700">Dark mode</span>
          <button className="flex items-center gap-2 p-1.5 rounded-full bg-white">
            <div className="p-1 rounded-full bg-gray-200 text-gray-500">
              <Sun size={16} />
            </div>
            <div className="p-1 text-gray-500">
              <Moon size={16} />
            </div>
          </button>
        </div>
      </div> */}

      {/* User section */}
      <div className="p-4 border-t border-gray-300 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src="https://cdn-icons-png.freepik.com/512/9703/9703596.png"
            alt="User Avatar"
            className="w-10 h-10 rounded-full border-3 border-green-500"
          />
          <div>
            <p className="font-semibold text-gray-800">Admin</p>
            <p className="text-sm text-gray-500">Mulya Jaya</p>
          </div>
        </div>
        {/* <Link to="/login" className="text-gray-500 hover:text-red-500 transition">
          <LogOut className="w-5 h-5" />
        </Link> */}
        <button
          onClick={() => {
            // Hapus token dari localStorage
            localStorage.removeItem("adminToken");

            // Redirect ke login
            window.location.href = "/login";
          }}
          className="text-gray-500 hover:text-red-500 transition flex items-center"
        >
          <LogOut className="w-5 h-5 mr-1" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
