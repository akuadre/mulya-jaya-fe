import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293-.293a1 1 0 000-1.414l-7-7z"></path>
        </svg>
      ),
    },
    {
      name: 'Manage products',
      path: '/products',
      icon: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 6a1 1 0 011-1h10a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V6zM6 9a1 1 0 000 2h8a1 1 0 100-2H6z"></path>
        </svg>
      ),
    },
    {
      name: 'Manage order',
      path: '/orders',
      icon: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
    },
    {
      name: 'Manage user',
      path: '/users',
      icon: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM20 18a8 8 0 10-16 0h16z"></path>
        </svg>
      ),
    },
    {
      name: 'Report',
      path: '/reports',
      icon: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100 2h6a1 1 0 100-2H7z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
    },
  ];

  const handleLogout = () => {
    // Logika logout, misalnya memanggil API
    console.log('User logged out');
  };

   return (
    <aside className="w-64 bg-white shadow-lg min-h-screen px-6 py-8 fixed top-0 left-0">
      <div className="p-4">
        <h1 className="text-3xl font-bold text-gray-800">MulyaAdmin</h1>
      </div>

      <nav className="mt-8 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-5 text-lg py-4 px-4 transition-colors duration-200 rounded-lg ${
                isActive
                  ? 'text-[#0ACF83] font-semibold bg-green-50 border-l-4 border-[#0ACF83]'
                  : 'text-gray-700 hover:text-[#0ACF83] hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
        {/* ... (Logout button) ... */}
      </nav>
    </aside>
  );
};

export default Sidebar;