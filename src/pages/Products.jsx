import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Search, Edit, Trash2, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

// Impor komponen UI baru
import Modal from "../components/Modal";
import FormInput from "../components/FormInput";
import Notification, { useNotification } from "../components/Notification";

const Products = () => {
  const authToken = localStorage.getItem("adminToken");

  // State utama
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State untuk filter dan paginasi
  const [filterText, setFilterText] = useState("");
  const [filterType, setFilterType] = useState("Semua");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // State untuk mengontrol modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // State untuk data yang sedang diproses
  const [newProduct, setNewProduct] = useState({
    name: "",
    type: "",
    price: "",
    description: "",
    stock: "",
    photo: null,
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  // Menggunakan hook notifikasi
  const { notification, showNotification, dismissNotification } =
    useNotification();

  // --- FUNGSI-FUNGSI LOGIKA ---

  const axiosHeaders = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${authToken}` },
    }),
    [authToken]
  );

  const fetchProducts = async () => {
    if (!authToken) return (window.location.href = "/login");
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/products",
        axiosHeaders
      );
      setProducts(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (err) {
      setError("Gagal memuat data. Pastikan server berjalan.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Memoization untuk filter dan paginasi
  const filteredItems = useMemo(() => {
    return products.filter((item) => {
      const matchText = JSON.stringify(item)
        .toLowerCase()
        .includes(filterText.toLowerCase());
      const matchType =
        filterType === "Semua" ||
        item.type.toLowerCase() === filterType.toLowerCase();
      return matchText && matchType;
    });
  }, [products, filterText, filterType]);

  const startIndex = page * rowsPerPage;
  const paginatedItems = useMemo(
    () => filteredItems.slice(startIndex, startIndex + rowsPerPage),
    [filteredItems, startIndex, rowsPerPage]
  );
  const totalPages = Math.ceil(filteredItems.length / rowsPerPage);

  // Handlers untuk perubahan input form
  const handleAddChange = (e) => {
    const { name, value, files } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    setEditingProduct((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Handlers untuk submit form
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    Object.keys(newProduct).forEach((key) =>
      formData.append(key, newProduct[key])
    );

    try {
      await axios.post("http://localhost:8000/api/products", formData, {
        headers: {
          ...axiosHeaders.headers,
          "Content-Type": "multipart/form-data",
        },
      });
      setIsAddModalOpen(false);
      fetchProducts();
      showNotification("Produk berhasil ditambahkan.", "success");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Gagal menambahkan produk.";
      showNotification(errorMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("_method", "PUT");
    Object.keys(editingProduct).forEach((key) => {
      if (key === "photo" && editingProduct[key] instanceof File) {
        formData.append("photo", editingProduct[key]);
      } else if (key !== "photo" && editingProduct[key] !== null) {
        formData.append(key, editingProduct[key]);
      }
    });

    try {
      await axios.post(
        `http://localhost:8000/api/products/${editingProduct.id}`,
        formData,
        {
          headers: {
            ...axiosHeaders.headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setIsEditModalOpen(false);
      fetchProducts();
      showNotification("Produk berhasil diperbarui.", "success");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Gagal memperbarui produk.";
      showNotification(errorMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    setIsSubmitting(true);
    try {
      await axios.delete(
        `http://localhost:8000/api/products/${productToDelete.id}`,
        axiosHeaders
      );
      setIsDeleteModalOpen(false);
      fetchProducts();
      showNotification("Produk berhasil dihapus.", "success");
    } catch (err) {
      showNotification("Gagal menghapus produk.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- KOMPONEN UI LOKAL ---
  const LoadingTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm animate-pulse">
        <thead className="bg-gray-50">
          <tr className="text-left text-gray-500 uppercase border-b border-gray-200">
            <th className="py-3 px-4">No</th>
            <th className="py-3 px-4">Foto</th>
            <th className="py-3 px-4">Nama</th>
            <th className="py-3 px-4">Jenis</th>
            <th className="py-3 px-4">Harga</th>
            <th className="py-3 px-4">Stok</th>
            <th className="py-3 px-4">Deskripsi</th>
            <th className="py-3 px-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(rowsPerPage)].map((_, index) => (
            <tr key={index} className="border-b border-gray-200">
              {/* No */}
              <td className="py-3 px-4">
                <div className="h-4 bg-gray-200 rounded w-6"></div>
              </td>
              {/* Foto */}
              <td className="py-3 px-4">
                <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
              </td>
              {/* Nama */}
              <td className="py-3 px-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </td>
              {/* Jenis */}
              <td className="py-3 px-4">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </td>
              {/* Harga */}
              <td className="py-3 px-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </td>
              {/* Stok */}
              <td className="py-3 px-4">
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </td>
              {/* Deskripsi */}
              <td className="py-3 px-4">
                <div className="h-4 bg-gray-200 rounded w-40"></div>
              </td>
              {/* Aksi */}
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <div className="h-8 w-16 bg-gray-200 rounded-lg"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded-lg"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <>
      <Notification
        notification={notification}
        onDismiss={dismissNotification}
      />

      <motion.div
        className="bg-white shadow-lg rounded-lg p-6 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-4 border-b pb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Manajemen Produk
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Kelola daftar produk Anda di halaman ini.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-3 w-full">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="pl-10 pr-4 py-2.5 border rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none bg-gray-50"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-gray-50"
            >
              <option value="Semua">Semua Jenis</option>
              <option value="pria">Pria</option>
              <option value="wanita">Wanita</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition flex items-center shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            <PlusCircle className="w-5 h-5 mr-1" />
            <span className="w-30">Tambah Produk</span>
          </button>
        </motion.div>

        <motion.div variants={itemVariants}>
          {loading ? (
            <LoadingTable />
          ) : error ? (
            <div className="text-center py-10 text-red-500 font-semibold">
              {error}
            </div>
          ) : (
            <div className="overflow-x-auto text-base">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-500 uppercase border-b border-gray-200">
                    <th className="py-3 px-4">No</th>
                    <th className="py-3 px-4">Foto</th>
                    <th className="py-3 px-4">Nama</th>
                    <th className="py-3 px-4">Jenis</th>
                    <th className="py-3 px-4">Harga</th>
                    <th className="py-3 px-4">Stok</th>
                    <th className="py-3 px-4">Deskripsi</th>
                    <th className="py-3 px-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((p, index) => (
                    <tr
                      key={p.id}
                      className="hover:bg-gray-50 border-b border-gray-200"
                    >
                      <td className="py-3 px-4 font-semibold text-gray-800">
                        {startIndex + index + 1}
                      </td>
                      <td className="py-3 px-4">
                        <img
                          src={
                            p.image_url
                              ? `http://localhost:8000/images/products/${p.image_url}`
                              : "https://placehold.co/80x80/E0E7FF/4338CA?text=No+Image"
                          }
                          alt={p.name}
                          className="w-20 h-20 object-cover rounded-md shadow-sm"
                        />
                      </td>
                      <td className="py-3 px-4 w-36">{p.name}</td>
                      <td className="py-3 px-4 w-32 capitalize">{p.type}</td>
                      <td className="py-3 px-4">
                        IDR {p.price ? p.price.toLocaleString("id-ID") : "-"}
                      </td>
                      <td className="py-3 px-4">{p.stock || "0"}</td>
                      <td className="py-3 px-4">
                        {p.description && p.description.length > 30
                          ? `${p.description.substring(0, 30)}...`
                          : p.description}
                      </td>

                      <td className="py-3 px-4 flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setIsEditModalOpen(true);
                          }}
                          className="bg-gray-100 text-gray-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-200 transition flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => {
                            setProductToDelete(p);
                            setIsDeleteModalOpen(true);
                          }}
                          className="bg-red-100 text-red-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-200 transition flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center p-2 text-sm text-gray-600 border-t mt-4"
        >
          <div className="flex items-center gap-2">
            <span>Baris per halaman:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(0);
              }}
              className="px-1 py-0 bg-transparent focus:outline-none border rounded"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
              className="px-2 py-1 border rounded hover:bg-gray-100 disabled:text-gray-400"
            >
              Sebelumnya
            </button>
            <span>
              {startIndex + 1}-
              {Math.min(startIndex + rowsPerPage, filteredItems.length)} dari{" "}
              {filteredItems.length}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
              disabled={page >= totalPages - 1}
              className="px-2 py-1 border rounded hover:bg-gray-100 disabled:text-gray-400"
            >
              Berikutnya
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Modal untuk Tambah Produk */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Produk Baru"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              onClick={handleAddSubmit}
              className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        }
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <FormInput
            label="Foto Produk"
            id="photo"
            name="photo"
            type="file"
            accept="image/*"
            onChange={handleAddChange}
            required
          />
          <FormInput
            label="Nama Produk"
            id="name"
            name="name"
            value={newProduct.name}
            onChange={handleAddChange}
            placeholder="Contoh: Kacamata Aviator"
            required
          />
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Jenis Produk
            </label>
            <select
              id="type"
              name="type"
              value={newProduct.type}
              onChange={handleAddChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Pilih Jenis</option>
              <option value="pria">Pria</option>
              <option value="wanita">Wanita</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
          <FormInput
            label="Harga"
            id="price"
            name="price"
            type="number"
            value={newProduct.price}
            onChange={handleAddChange}
            placeholder="Contoh: 150000"
            required
          />
          <FormInput
            label="Stok"
            id="stock"
            name="stock"
            type="number"
            value={newProduct.stock}
            onChange={handleAddChange}
            placeholder="Contoh: 50"
            required
          />
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Deskripsi
            </label>
            <textarea
              id="description"
              name="description"
              value={newProduct.description}
              onChange={handleAddChange}
              placeholder="Deskripsi singkat produk"
              rows="3"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            ></textarea>
          </div>
        </form>
      </Modal>

      {/* Modal untuk Edit Produk */}
      {editingProduct && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Produk"
          footer={
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300"
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button
                onClick={handleEditSubmit}
                className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          }
        >
          <form onSubmit={handleEditSubmit} className="space-y-4">
            {editingProduct.image_url &&
              !(editingProduct.photo instanceof File) && (
                <img
                  src={`http://localhost:8000/images/products/${editingProduct.image_url}`}
                  alt={editingProduct.name}
                  className="w-24 h-24 object-cover rounded-lg mb-2"
                />
              )}
            <FormInput
              label="Ganti Foto (Opsional)"
              id="edit-photo"
              name="photo"
              type="file"
              accept="image/*"
              onChange={handleEditChange}
            />
            <FormInput
              label="Nama Produk"
              id="edit-name"
              name="name"
              value={editingProduct.name}
              onChange={handleEditChange}
              required
            />
            <div>
              <label
                htmlFor="edit-type"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Jenis Produk
              </label>
              <select
                id="edit-type"
                name="type"
                value={editingProduct.type}
                onChange={handleEditChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Pilih Jenis</option>
                <option value="pria">Pria</option>
                <option value="wanita">Wanita</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
            <FormInput
              label="Harga"
              id="edit-price"
              name="price"
              type="number"
              value={editingProduct.price}
              onChange={handleEditChange}
              required
            />
            <FormInput
              label="Stok"
              id="edit-stock"
              name="stock"
              type="number"
              value={editingProduct.stock}
              onChange={handleEditChange}
              required
            />
            <div>
              <label
                htmlFor="edit-description"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Deskripsi
              </label>
              <textarea
                id="edit-description"
                name="description"
                value={editingProduct.description}
                onChange={handleEditChange}
                rows="3"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              ></textarea>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal untuk Konfirmasi Hapus */}
      {productToDelete && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Konfirmasi Hapus"
          footer={
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300"
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          }
        >
          <p>
            Anda yakin ingin menghapus produk{" "}
            <span className="font-bold">{productToDelete.name}</span>? Tindakan
            ini tidak dapat dibatalkan.
          </p>
        </Modal>
      )}
    </>
  );
};

export default Products;
