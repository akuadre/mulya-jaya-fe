const Navbar = () => {
  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 w-full z-10">
      {/* Left: Title / Breadcrumb */}
      <h1 className="text-xl font-semibold text-gray-800">
        Mulya Jaya Dashboard
      </h1>

      {/* Right: User & Logout */}
      <div className="flex items-center space-x-4">
        {/* User info (dummy dulu) */}
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700">Admin</p>
          <p className="text-xs text-gray-500">admin@mulya-jaya.com</p>
        </div>

        {/* Avatar */}
        <img
          src="https://ui-avatars.com/api/?name=Admin"
          alt="User Avatar"
          className="w-10 h-10 rounded-full border"
        />

        {/* Logout button */}
        <button className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-3 py-2 rounded-lg transition">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;