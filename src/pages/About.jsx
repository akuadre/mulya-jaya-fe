import { motion } from "framer-motion";
import {
  Info,
  CheckCircle,
  Code,
  Server,
  Package,
  Headset, // Ikon baru untuk kontak
  Mail,      // Ikon baru untuk email
  Building,  // Ikon baru untuk alamat
} from "lucide-react";

// Helper Component untuk menampilkan item teknologi
const TechItem = ({ icon, name }) => (
  <div className="flex items-center gap-3 bg-gray-100 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors">
    <img src={icon} alt={name} className="w-6 h-6 object-contain" />
    <span className="font-medium text-gray-700 text-sm">{name}</span>
  </div>
);

// Helper Component untuk item kontak
const ContactItem = ({ icon: Icon, title, value }) => (
    <div className="flex items-center gap-4 text-left">
        <Icon className="w-8 h-8 text-green-500 flex-shrink-0" />
        <div>
            <p className="text-sm font-semibold text-gray-500">{title}</p>
            <p className="text-gray-800 font-medium">{value}</p>
        </div>
    </div>
);

const About = () => {
  // Data untuk ditampilkan
  const features = [
    "Dashboard analitik dengan ringkasan penjualan",
    "Manajemen produk (CRUD) dengan filter & pencarian",
    "Pelacakan dan pembaruan status pesanan",
    "Manajemen data pelanggan",
    "Laporan penjualan (Harian, Bulanan, Tahunan)",
  ];

  const frontendTech = [
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Vite", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" },
    { name: "Tailwind CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" },
    { name: "Framer Motion", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/framermotion/framermotion-original.svg" },
  ];
  
  const backendTech = [
    // PERBAIKAN: Menggunakan URL ikon Laravel yang valid dan lebih bagus
    { name: "Laravel", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg" },
    { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original-wordmark.svg" },
  ];

  // Varian animasi
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* --- Hero Section --- */}
      <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <div className="inline-block bg-green-500/10 p-4 rounded-xl text-green-500 mb-4">
          <Package size={40} />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
          Admin Dashboard Mulya Jaya
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-gray-600">
          Aplikasi ini dirancang untuk menyediakan antarmuka yang efisien dan modern bagi administrator Toko Kacamata Mulya Jaya untuk mengelola operasi bisnis sehari-hari.
        </p>
        <span className="mt-4 inline-block bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
          Versi 1.0.0
        </span>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Fitur Utama --- */}
        <motion.div variants={itemVariants} className="bg-white lg:col-span-2 p-8 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Info className="text-blue-500" size={24} />
            <h2 className="text-2xl font-semibold text-gray-800">Fitur Utama</h2>
          </div>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </motion.div>
        
        {/* --- KARTU BARU: Kontak & Bantuan --- */}
        <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-lg flex flex-col">
            <div className="flex items-center gap-3 mb-6">
                <Headset className="text-green-500" size={24}/>
                <h2 className="text-2xl font-semibold text-gray-800">Bantuan & Dukungan</h2>
            </div>
            <p className="text-gray-600 mb-6 text-sm">
                Jika Anda mengalami kendala teknis atau memiliki pertanyaan, jangan ragu untuk menghubungi kami.
            </p>
            <div className="space-y-5 mt-auto">
                <ContactItem icon={Mail} title="Email Dukungan" value="support@mulyajaya.com" />
                <ContactItem icon={Building} title="Alamat Kantor" value="Jl. Optik No. 24, Cimahi" />
            </div>
        </motion.div>
      </div>

      {/* --- Teknologi yang Digunakan --- */}
      <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Teknologi yang Digunakan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Frontend */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Code className="text-purple-500" size={22} />
              <h3 className="text-lg font-bold text-gray-700">Frontend</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {frontendTech.map(tech => <TechItem key={tech.name} {...tech} />)}
            </div>
          </div>
          {/* Backend */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Server className="text-orange-500" size={22} />
              <h3 className="text-lg font-bold text-gray-700">Backend</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {backendTech.map(tech => <TechItem key={tech.name} {...tech} />)}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default About;