import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Search, Edit, Trash2, PlusCircle, Filter } from "lucide-react";
import { motion } from "framer-motion";

// Impor komponen UI baru
import Modal from "../components/Modal";
import FormInput from "../components/FormInput";
import Notification, { useNotification } from "../components/Notification";
import axiosClient from "../lib/axiosClient";

// --- KOMPONEN GAMBAR DENGAN LOADER (SKELETON) ---
const ImageWithLoader = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="w-12 h-12 sm:w-16 sm:h-16 relative">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 rounded-md animate-pulse"></div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover rounded-md shadow-sm transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "https://placehold.co/80x80/f3f4f6/4f4f4f?text=Gagal";
        }}
      />
    </div>
  );
};

// --- KOMPONEN CARD UNTUK MOBILE ---
const ProductCard = ({ product, index, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <ImageWithLoader
          src={
            product.image_url
              ? `${import.meta.env.VITE_API_URL}/images/products/${product.image_url}`
              : "https://placehold.co/80x80/f3f4f6/4f4f4f?text=N/A"
          }
          alt={product.name}
        />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
            <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full capitalize">
              {product.type}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            IDR {product.price ? product.price.toLocaleString("id-ID") : "-"}
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span>Stok: {product.stock || "0"}</span>
          </div>
          {product.description && (
            <p className="text-xs text-gray-500 mt-2 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
        <button
          onClick={() => onEdit(product)}
          className="flex-1 bg-gray-100 text-gray-700 font-medium px-3 py-2 rounded-lg hover:bg-gray-200 transition flex items-center justify-center text-sm"
        >
          <Edit className="w-4 h-4 mr-1" /> Edit
        </button>
        <button
          onClick={() => onDelete(product)}
          className="flex-1 bg-red-100 text-red-700 font-medium px-3 py-2 rounded-lg hover:bg-red-200 transition flex items-center justify-center text-sm"
        >
          <Trash2 className="w-4 h-4 mr-1" /> Hapus
        </button>
      </div>
    </div>
  );
};

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

  const fetchProducts = async () => {
    if (!authToken) return (window.location.href = "/login");
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get("/api/products");
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
      await axiosClient.post("/api/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setIsAddModalOpen(false);
      setNewProduct({
        name: "",
        type: "",
        price: "",
        description: "",
        stock: "",
        photo: null,
      });
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
      await axiosClient.post(
        `/api/products/${editingProduct.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setIsEditModalOpen(false);
      setEditingProduct(null);
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
      await axiosClient.delete(
        `/api/products/${productToDelete.id}`
      );
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      fetchProducts();
      showNotification("Produk berhasil dihapus.", "success");
    } catch (err) {
      showNotification("Gagal menghapus produk.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handlers untuk edit dan delete dari card
  const handleEditFromCard = (product) => {
    setEditingProduct({
      ...product,
      type: product.type.toLowerCase(),
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteFromCard = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
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
            <th className="py-3 px-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(rowsPerPage)].map((_, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-3 px-4">
                <div className="h-4 bg-gray-200 rounded w-6"></div>
              </td>
              <td className="py-3 px-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-md"></div>
              </td>
              <td className="py-3 px-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </td>
              <td className="py-3 px-4">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </td>
              <td className="py-3 px-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </td>
              <td className="py-3 px-4">
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </td>
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

  const LoadingCards = () => (
    <div className="space-y-4">
      {[...Array(rowsPerPage)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
            <div className="flex-1">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-32 mt-2"></div>
              <div className="h-3 bg-gray-200 rounded w-20 mt-1"></div>
            </div>
          </div>
          <div className="flex gap-2 mt-3 pt-3">
            <div className="h-8 bg-gray-200 rounded-lg flex-1"></div>
            <div className="h-8 bg-gray-200 rounded-lg flex-1"></div>
          </div>
        </div>
      ))}
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
        className="bg-white shadow-lg rounded-lg p-4 sm:p-6 space-y-4 w-full min-w-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-4 border-b pb-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
            Manajemen Produk
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Kelola daftar produk Anda di halaman ini.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="pl-10 pr-4 py-2.5 border rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none bg-gray-50 text-sm sm:text-base"
              />
            </div>
            <div className="relative w-full sm:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-gray-50 w-full text-sm sm:text-base"
              >
                <option value="Semua">Semua Jenis</option>
                <option value="pria">Pria</option>
                <option value="wanita">Wanita</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2.5 sm:py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap"
            disabled={isSubmitting}
          >
            <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span>Tambah Produk</span>
          </button>
        </motion.div>

        <motion.div variants={itemVariants}>
          {loading ? (
            <>
              {/* Loading untuk desktop (table) */}
              <div className="hidden lg:block">
                <LoadingTable />
              </div>
              {/* Loading untuk mobile (cards) */}
              <div className="lg:hidden">
                <LoadingCards />
              </div>
            </>
          ) : error ? (
            <div className="text-center py-10 text-red-500 font-semibold">
              {error}
            </div>
          ) : (
            <>
              {/* Desktop View - Table */}
              <div className="hidden lg:block overflow-x-auto w-full min-w-0">
                <table className="w-full text-sm border-collapse min-w-[600px]">
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
                          <ImageWithLoader
                            src={
                              p.image_url
                                ? `${import.meta.env.VITE_API_URL}/images/products/${p.image_url}`
                                : "https://placehold.co/80x80/f3f4f6/4f4f4f?text=N/A"
                            }
                            alt={p.name}
                          />
                        </td>
                        <td className="py-3 px-4 max-w-[150px] truncate">{p.name}</td>
                        <td className="py-3 px-4 capitalize">{p.type}</td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          IDR {p.price ? p.price.toLocaleString("id-ID") : "-"}
                        </td>
                        <td className="py-3 px-4">{p.stock || "0"}</td>
                        <td className="py-3 px-4 max-w-[200px]">
                          {p.description && p.description.length > 50
                            ? `${p.description.substring(0, 50)}...`
                            : p.description}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditFromCard(p)}
                              className="bg-gray-100 text-gray-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-200 transition flex items-center text-sm"
                            >
                              <Edit className="w-4 h-4 mr-1" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteFromCard(p)}
                              className="bg-red-100 text-red-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-200 transition flex items-center text-sm"
                            >
                              <Trash2 className="w-4 h-4 mr-1" /> Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View - Cards */}
              <div className="lg:hidden space-y-4">
                {paginatedItems.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    onEdit={handleEditFromCard}
                    onDelete={handleDeleteFromCard}
                  />
                ))}
              </div>
            </>
          )}
        </motion.div>

        {/* Pagination */}
        {filteredItems.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-between items-center gap-4 p-2 text-sm text-gray-600 border-t mt-4 pt-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">Baris per halaman:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setPage(0);
                }}
                className="px-2 py-1 bg-transparent focus:outline-none border rounded text-sm"
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
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-sm"
              >
                Sebelumnya
              </button>
              <span className="text-sm">
                {startIndex + 1}-{Math.min(startIndex + rowsPerPage, filteredItems.length)} dari {filteredItems.length}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-sm"
              >
                Berikutnya
              </button>
            </div>
          </motion.div>
        )}

        {!loading && filteredItems.length === 0 && (
          <motion.div variants={itemVariants} className="text-center py-8 text-gray-500">
            {filterText || filterType !== "Semua" 
              ? "Tidak ada produk yang sesuai dengan filter" 
              : "Belum ada produk. Tambah produk pertama Anda!"}
          </motion.div>
        )}
      </motion.div>

      {/* Modal untuk Tambah Produk */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Produk Baru"
        footer={
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              form="addProductForm"
              className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition text-sm sm:text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        }
      >
        <form id="addProductForm" onSubmit={handleAddSubmit} className="space-y-4">
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              required
            ></textarea>
          </div>
        </form>
      </Modal>

      {/* Modal untuk Edit Produk */}
      {editingProduct && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingProduct(null);
          }}
          title="Edit Produk"
          footer={
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingProduct(null);
                }}
                className="bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button
                type="submit"
                form="editProductForm"
                className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition text-sm sm:text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          }
        >
          <form id="editProductForm" onSubmit={handleEditSubmit} className="space-y-4">
            {editingProduct.image_url &&
              !(editingProduct.photo instanceof File) && (
                <div className="flex justify-center">
                  <img  
                    src={`${import.meta.env.VITE_API_URL}/images/products/${editingProduct.image_url}`}
                    alt={editingProduct.name}
                    className="w-24 h-24 object-cover rounded-lg mb-2"
                  />
                </div>
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
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
          onClose={() => {
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
          }}
          title="Konfirmasi Hapus"
          footer={
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setProductToDelete(null);
                }}
                className="bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition text-sm sm:text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          }
        >
          <p className="text-sm sm:text-base">
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