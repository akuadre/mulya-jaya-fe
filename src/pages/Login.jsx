import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Loader, AlertCircle, Eye, EyeOff } from "lucide-react";

import axiosClient from "../lib/axiosClient";

// --- Komponen Input Underline Style (disesuaikan untuk Dim Mode) ---
const UnderlineInput = ({
  id,
  type,
  value,
  onChange,
  placeholder,
  icon,
  children,
}) => {
  return (
    <div className="relative border-b-2 border-slate-700 focus-within:border-emerald-500 transition-colors duration-300">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-500">
        {icon}
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none"
        required
        autoComplete="off"
      />
      {children}
    </div>
  );
};

// --- Komponen Utama Login ---
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axiosClient.post("/api/admin/login", {

        email,
        password,
      });
      localStorage.setItem("adminToken", res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Email atau password salah!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 overflow-hidden relative"
      style={{
        backgroundImage: "url('images/toko.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay gelap supaya form tetap jelas */}
      <div className="absolute inset-0 bg-slate-900/70" />

      {/* Animated Blobs Background */}
      <div className="absolute w-full h-full overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/30 rounded-full filter blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "mirror" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/30 rounded-full filter blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, -50, 0], y: [0, 50, 0] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "mirror",
            delay: 7,
          }}
        />
      </div>

      {/* Box login tetap di atas */}
      <motion.div
        className="relative z-10 w-full max-w-md bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/80 p-10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="text-center mb-12">
          {/* --- Centerpiece Visual Baru --- */}
          <motion.div
            className="relative w-28 h-28 mx-auto mb-5"
            initial={{ scale: 0, rotate: -45 }}
            animate={{
              scale: 1,
              rotate: 0,
              transition: {
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2,
              },
            }}
          >
            <div className="absolute inset-0 bg-slate-700 rounded-full border-2 border-slate-600">
              <img
                src="https://media.istockphoto.com/id/1419766496/photo/abstract-concepts-of-cybersecurity-technology-and-digital-data-protection-protect-internet.jpg?s=612x612&w=0&k=20&c=3GM-GKO4wrU1wj03fE21cQXSVhvGBF8AO-9lOLpiaq8="
                alt="Abstract background"
                className="w-full h-full object-cover rounded-full opacity-30"
              />
            </div>
            <img
              src="images/mulyajaya.png"
              alt="Icon Mulya Jaya"
              className="absolute inset-0 p-5 w-full h-full object-contain"
            />
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-100">Mulya Jaya App</h1>
          <p className="text-slate-400 mt-1">Selamat datang kembali, Admin!</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/20 border border-red-500/30 text-red-300 p-3 rounded-lg flex items-center gap-3 text-sm"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <UnderlineInput
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            icon={<Mail size={20} />}
          />

          <UnderlineInput
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            icon={<Lock size={20} />}
          >
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-emerald-500 transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </UnderlineInput>

          <div>
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-6 rounded-lg bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all duration-300 disabled:bg-slate-600"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? <Loader className="animate-spin w-6 h-6" /> : "Login"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
