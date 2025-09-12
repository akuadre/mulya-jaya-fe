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
import { NavLink } from "react-router-dom";

const NavItem = ({ to, icon: Icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
        isActive ? "bg-green-600/75 text-white" : "text-gray-500 hover:bg-gray-100"
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
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">MulyaAdmin</h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 space-y-1">
        <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">
          Main
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
      <div className="p-4 border-t">
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
      </div>

      {/* User section */}
      <div className="p-4 border-t flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src="https://ui-avatars.com/api/?name=Admin+User&background=c7d2fe&color=3730a3"
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold text-gray-800">Admin User</p>
            <p className="text-sm text-gray-500">Super Admin</p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-red-500 transition">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
