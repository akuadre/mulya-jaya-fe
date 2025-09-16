import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ganti sesuai endpoint backend kamu
      const res = await axios.post("http://localhost:8000/api/admin/login", {
        email,
        password,
      });

      console.log("Login berhasil:", res.data);

      // simpan token Bearer
      localStorage.setItem("adminToken", res.data.token);

      // redirect (kalau pake react-router-dom v6)
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Email atau password salah!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 p-4 font-sans">
      <div className="relative w-full max-w-6xl h-[720px] bg-white rounded-3xl shadow-xl overflow-hidden flex">
        {/* Left Side (Form) */}
        <div className="flex-1 flex flex-col justify-center p-16">
          <div className="absolute top-16 left-16 flex items-center space-x-2">
            <svg
              className="h-6 w-6 text-emerald-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-8h2v-4h-2v4zm0 6h2v-2h-2v2z" />
            </svg>
            <span className="font-bold text-gray-800">MulyaJaya app.</span>
          </div>

          <div className="flex flex-col space-y-16">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">
                Welcome back, admin!
              </p>
              <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                Login to your account
              </h1>
              <p className="text-gray-500 mt-2">
                Mulya Jaya Admin Web
                
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <div className="relative">
                <input
                  type="email"
                  id="email"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <input
                  type="password"
                  id="password"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side (Image & SVG) */}
        <div className="relative flex-1 hidden lg:block">
          <img
            src="https://bsg-i.nbxc.com/product/ef/43/18/b49a090095d84f6fc35f8bf257.jpg"
            alt="Login illustration"
            className="absolute inset-0 h-full w-full object-cover rounded-3xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
