import { useState, useMemo } from "react";
import { Search, Edit, Trash2, PlusCircle, XCircle } from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      no: 1,
      foto: "https://placehold.co/80x80/E0E7FF/4338CA?text=Kacamata",
      nama: "Dior",
      jenis: "Membaca",
      harga: 2000000,
      deskripsi:
        "Kacamata Dior edisi terbaru dengan kualitas premium dan desain elegan.",
    },
    {
      id: 2,
      no: 2,
      foto: "https://placehold.co/80x80/E0E7FF/4338CA?text=Kacamata",
      nama: "Chanel",
      jenis: "Fashion",
      harga: 3500000,
      deskripsi:
        "Kacamata Chanel modis untuk menunjang gaya fashion sehari-hari.",
    },
    {
      id: 3,
      no: 3,
      foto: "https://placehold.co/80x80/E0E7FF/4338CA?text=Kacamata",
      nama: "Gucci",
      jenis: "Aksesoris",
      harga: 1750000,
      deskripsi: "Kacamata Gucci klasik dengan material berkualitas tinggi.",
    },
  ]);

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
    foto: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Filter produk
  const filteredItems = products.filter((item) => {
    const matchText = JSON.stringify(item)
      .toLowerCase()
      .includes(filterText.toLowerCase());
    const matchJenis =
      filterJenis === "Semua" || item.jenis === filterJenis;
    return matchText && matchJenis;
  });

  // Ambil data sesuai halaman
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredItems.length / rowsPerPage);

  // Tambah produk
  const handleAddChange = (e) => {
    if (e.target.name === "foto") {
      const file = e.target.files[0];
      if (file) {
        setNewProduct({
          ...newProduct,
          foto: URL.createObjectURL(file),
        });
      }
    } else {
      setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newId =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

    setProducts([
      ...products,
      {
        id: newId,
        no: products.length + 1,
        foto:
          newProduct.foto ||
          "https://placehold.co/80x80/E0E7FF/4338CA?text=Kacamata",
        ...newProduct,
        harga: parseInt(newProduct.harga),
      },
    ]);

    setShowAddModal(false);
    setNewProduct({ nama: "", jenis: "", harga: "", deskripsi: "", foto: "" });
  };

  // Edit produk
  const handleEditChange = (e) => {
    if (e.target.name === "foto") {
      const file = e.target.files[0];
      if (file) {
        setEditingProduct({
          ...editingProduct,
          foto: URL.createObjectURL(file),
        });
      }
    } else {
      setEditingProduct({
        ...editingProduct,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedProducts = products.map((p) =>
      p.id === editingProduct.id
        ? {
            ...editingProduct,
            harga: parseInt(editingProduct.harga),
          }
        : p
    );
    setProducts(updatedProducts);
    setShowEditModal(false);
    setEditingProduct(null);
  };

  // Hapus produk
  const handleDelete = (id) => {
    setDeleteProductId(id);
    setShowDeleteModal(true);
  };
  const confirmDelete = () => {
    const updatedProducts = products.filter((p) => p.id !== deleteProductId);
    setProducts(updatedProducts.map((p, index) => ({ ...p, no: index + 1 })));
    setShowDeleteModal(false);
    setDeleteProductId(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Header */}
        <div className="mb-4 border-b pb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Manajemen Produk
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Kelola daftar produk Anda di halaman ini.
          </p>
        </div>

        {/* Search + Filter + Tambah */}
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
              <option value="Membaca">Membaca</option>
              <option value="Fashion">Fashion</option>
              <option value="Aksesoris">Aksesoris</option>
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
                <tr key={p.id} className="hover:bg-gray-50 border-b border-gray-200">
                  <td className="py-3 px-4 font-semibold text-gray-800">{p.no}</td>
                  <td className="py-3 px-4">
                    <img
                      src={p.foto}
                      alt={p.nama}
                      className="w-16 h-16 object-cover rounded-md shadow-sm"
                    />
                  </td>
                  <td className="py-3 px-4">{p.nama}</td>
                  <td className="py-3 px-4">{p.jenis}</td>
                  <td className="py-3 px-4">IDR {p.harga.toLocaleString("id-ID")}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {p.deskripsi.length > 30 ? `${p.deskripsi.substring(0, 30)}...` : p.deskripsi}
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
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center p-2 text-sm text-gray-600 border-t mt-4">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
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
              Prev
            </button>
            <span>{startIndex + 1}-{Math.min(endIndex, filteredItems.length)} of {filteredItems.length}</span>
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))}
              disabled={page >= totalPages - 1}
              className="px-2 py-1 border rounded hover:bg-gray-100 disabled:text-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal Tambah */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
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
              <input
                type="file"
                name="foto"
                accept="image/*"
                onChange={handleAddChange}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
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

      {/* Modal Edit */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Edit Produk</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <XCircle className="w-7 h-7" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input type="file" name="foto" accept="image/*" onChange={handleEditChange} className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <input type="text" name="nama" value={editingProduct.nama} onChange={handleEditChange} placeholder="Nama Produk" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
              <input type="text" name="jenis" value={editingProduct.jenis} onChange={handleEditChange} placeholder="Jenis Produk" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
              <input type="number" name="harga" value={editingProduct.harga} onChange={handleEditChange} placeholder="Harga" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
              <textarea name="deskripsi" value={editingProduct.deskripsi} onChange={handleEditChange} placeholder="Deskripsi" rows="4" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition">Batal</button>
                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
