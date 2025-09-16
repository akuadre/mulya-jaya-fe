import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Search, Edit, Trash2, PlusCircle, XCircle } from "lucide-react";

// Main component for product management
const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterText, setFilterText] = useState("");
  const [filterJenis, setFilterJenis] = useState("Semua");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deleteProductId, setDeleteProductId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    nama: "",
    jenis: "",
    harga: "",
    deskripsi: "",
    foto: null, // Store file object for new product
  });
  const [editingProduct, setEditingProduct] = useState(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Function to fetch products from the API
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:8000/api/products");
      // Add 'no' property for display and ensure data is an array
      const dataWithNo = Array.isArray(response.data.data) ? response.data.data.map((item, index) => ({ ...item, no: index + 1 })) : [];
      setProducts(dataWithNo);
    } catch (err) {
      setError("Gagal memuat data. Pastikan server Laravel berjalan.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter and paginate products
  const filteredItems = useMemo(() => {
    return products.filter((item) => {
      const matchText = JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase());
      const matchJenis = filterJenis === "Semua" || item.jenis === filterJenis;
      return matchText && matchJenis;
    });
  }, [products, filterText, filterJenis]);

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredItems.length / rowsPerPage);

  // Handle adding a new product
  const handleAddChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto") {
      setNewProduct({ ...newProduct, foto: files[0] });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nama", newProduct.nama);
    formData.append("jenis", newProduct.jenis);
    formData.append("harga", newProduct.harga);
    formData.append("deskripsi", newProduct.deskripsi);
    if (newProduct.foto) {
      formData.append("foto", newProduct.foto);
    }

    try {
      await axios.post("http://localhost:8000/api/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setShowAddModal(false);
      setNewProduct({ nama: "", jenis: "", harga: "", deskripsi: "", foto: null });
      fetchProducts(); // Refresh the list
    } catch (err) {
      setError("Gagal menambahkan produk. Coba lagi.");
      console.error("Add error:", err);
    }
  };

  // Handle editing a product
  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto") {
      setEditingProduct({ ...editingProduct, foto: files[0] });
    } else {
      setEditingProduct({ ...editingProduct, [name]: value });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("_method", "PUT"); // For Laravel to recognize PUT request with FormData
    formData.append("nama", editingProduct.nama);
    formData.append("jenis", editingProduct.jenis);
    formData.append("harga", editingProduct.harga);
    formData.append("deskripsi", editingProduct.deskripsi);
    if (editingProduct.foto instanceof File) {
      formData.append("foto", editingProduct.foto);
    }

    try {
      await axios.post(`http://localhost:8000/api/products/${editingProduct.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setShowEditModal(false);
      setEditingProduct(null);
      fetchProducts(); // Refresh the list
    } catch (err) {
      setError("Gagal memperbarui produk. Coba lagi.");
      console.error("Edit error:", err);
    }
  };

  // Handle deleting a product
  const handleDelete = (id) => {
    setDeleteProductId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/products/${deleteProductId}`);
      setShowDeleteModal(false);
      setDeleteProductId(null);
      fetchProducts(); // Refresh the list
    } catch (err) {
      setError("Gagal menghapus produk. Coba lagi.");
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans p-8">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 border-b pb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Manajemen Produk
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Kelola daftar produk Anda di halaman ini.
          </p>
        </div>

        {/* Search + Filter + Add */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3 w-full">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <select
              value={filterJenis}
              onChange={(e) => setFilterJenis(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="Semua">Semua Jenis</option>
              {useMemo(() => [...new Set(products.map(p => p.jenis))], [products]).map(jenis => (
                <option key={jenis} value={jenis}>{jenis}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition flex items-center shadow-md"
          >
            <PlusCircle className="w-5 h-5 mr-1" />
            <span className="w-30">Tambah Produk</span>
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">Memuat data...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500 font-semibold">{error}</div>
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
                  <th className="py-3 px-4">Deskripsi</th>
                  <th className="py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map((p) => (
                  // Add a check to ensure 'p' is not undefined before rendering
                  p && <tr key={p.id} className="hover:bg-gray-50 border-b border-gray-200">
                    <td className="py-3 px-4 font-semibold text-gray-800">{p.no}</td>
                    <td className="py-3 px-4">
                      <img
                        src={p.image_url 
                          ? `http://localhost:8000/images/products/${p.image_url}` 
                          : "https://placehold.co/80x80/E0E7FF/4338CA?text=No+Image"}
                        alt={p.name}
                        className="w-20 h-20 object-cover rounded-md shadow-sm"
                      />
                    </td>
                    <td className="py-3 px-4">{p.name}</td>
                    <td className="py-3 px-4">{p.type}</td>
                    {/* Add a check for p.harga before calling toLocaleString() */}
                    <td className="py-3 px-4">IDR {p.price ? p.price.toLocaleString("id-ID") : '-'}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {p.description && p.description.length > 30 ? `${p.description.substring(0, 30)}...` : p.description}
                    </td>
                    <td className="py-3 px-4 flex items-center gap-2">
                      <button
                        onClick={() => { setEditingProduct(p); setShowEditModal(true); }}
                        className="bg-blue-100 text-blue-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-200 transition flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
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

        {/* Pagination */}
        <div className="flex justify-between items-center p-2 text-sm text-gray-600 border-t mt-4">
          <div className="flex items-center gap-2">
            <span>Baris per halaman:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
              className="px-1 py-0 bg-transparent focus:outline-none border rounded"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 0))}
              disabled={page === 0}
              className="px-2 py-1 border rounded hover:bg-gray-100 disabled:text-gray-400"
            >
              Sebelumnya
            </button>
            <span>{startIndex + 1}-{Math.min(endIndex, filteredItems.length)} dari {filteredItems.length}</span>
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))}
              disabled={page >= totalPages - 1}
              className="px-2 py-1 border rounded hover:bg-gray-100 disabled:text-gray-400"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>

      {/* Modal Tambah */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-screen">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Tambah Produk</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <XCircle className="w-7 h-7" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <input type="file" name="foto" accept="image/*" onChange={handleAddChange} className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
              <input type="text" name="nama" value={newProduct.nama} onChange={handleAddChange} placeholder="Nama Produk" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
              <input type="text" name="jenis" value={newProduct.jenis} onChange={handleAddChange} placeholder="Jenis Produk" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
              <input type="number" name="harga" value={newProduct.harga} onChange={handleAddChange} placeholder="Harga" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
              <textarea name="deskripsi" value={newProduct.deskripsi} onChange={handleAddChange} placeholder="Deskripsi" rows="4" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition">Batal</button>
                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
      

     {showEditModal && editingProduct && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Edit Produk</h2>
        <button
          onClick={() => setShowEditModal(false)}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleEditSubmit} className="space-y-4">
        {/* Preview foto lama */}
        {editingProduct.image_url && !(editingProduct.foto instanceof File) && (
          <img
            src={`http://localhost:8000/images/products/${editingProduct.image_url}`}
            alt={editingProduct.nama}
            className="w-24 h-24 object-cover rounded-lg mb-2"
          />
        )}

        {/* Input file */}
        <input
          type="file"
          name="image_url"
          accept="image/*"
          onChange={handleEditChange}
          className="w-full border border-gray-300 p-2 rounded-lg"
        />

        <input
          type="text"
          name="name"
          value={editingProduct.name || ""}
          onChange={handleEditChange}
          placeholder="Nama Produk"
          className="w-full border border-gray-300 p-3 rounded-lg"
          required
        />

        <input
          type="text"
          name="type"
          value={editingProduct.type || ""}
          onChange={handleEditChange}
          placeholder="Jenis Produk"
          className="w-full border border-gray-300 p-3 rounded-lg"
          required
        />

        <input
          type="number"
          name="price"
          value={editingProduct.price || ""}
          onChange={handleEditChange}
          placeholder="Harga"
          className="w-full border border-gray-300 p-3 rounded-lg"
          required
        />

        <textarea
          name="description"
          value={editingProduct.description || ""}
          onChange={handleEditChange}
          placeholder="Deskripsi"
          rows="4"
          className="w-full border border-gray-300 p-3 rounded-lg"
          required
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => setShowEditModal(false)}
            className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  </div>
)}



      {/* Modal Delete Confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Konfirmasi Hapus</h2>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus produk ini?</p>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition">Batal</button>
              <button type="button" onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
