import { useState, useMemo, Fragment } from "react";
import DataTable from "react-data-table-component";
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
      deskripsi: "Kacamata Dior edisi terbaru dengan kualitas premium dan desain elegan.",
    },
    {
      id: 2,
      no: 2,
      foto: "https://placehold.co/80x80/E0E7FF/4338CA?text=Kacamata",
      nama: "Chanel",
      jenis: "Fashion",
      harga: 3500000,
      deskripsi: "Kacamata Chanel modis untuk menunjang gaya fashion sehari-hari.",
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  
  const [newProduct, setNewProduct] = useState({
    nama: "",
    jenis: "",
    harga: "",
    deskripsi: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);

  const filteredItems = products.filter(
    (item) =>
      JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase())
  );

  const handleAddChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditingProduct({ ...editingProduct, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    setProducts([
      ...products,
      {
        id: newId,
        no: products.length + 1,
        foto: "https://placehold.co/80x80/E0E7FF/4338CA?text=Kacamata",
        ...newProduct,
        harga: parseInt(newProduct.harga),
      },
    ]);
    setShowAddModal(false);
    setNewProduct({ nama: "", jenis: "", harga: "", deskripsi: "" });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setProducts(
      products.map((p) => (p.id === editingProduct.id ? editingProduct : p))
    );
    setShowEditModal(false);
    setEditingProduct(null);
  };

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

  const columns = useMemo(() => [
    {
      name: "No",
      selector: (row) => row.no,
      sortable: true,
      width: "60px",
    },
    {
      name: "Foto",
      cell: (row) => (
        <img
          src={row.foto}
          alt={row.nama}
          className="w-16 h-16 object-cover rounded-md my-2 shadow-sm"
        />
      ),
      grow: 0,
      width: "100px",
    },
    {
      name: "Nama",
      selector: (row) => row.nama,
      sortable: true,
      grow: 1,
    },
    {
      name: "Jenis",
      selector: (row) => row.jenis,
      sortable: true,
      grow: 1,
    },
    {
      name: "Harga",
      selector: (row) => `IDR ${row.harga.toLocaleString("id-ID")}`,
      sortable: true,
      grow: 1,
    },
    {
      name: "Deskripsi",
      selector: (row) => row.deskripsi.length > 25 ? `${row.deskripsi.substring(0, 25)}...` : row.deskripsi,
      grow: 2,
    },
    {
      name: "Aksi",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setEditingProduct(row);
              setShowEditModal(true);
            }}
            className="bg-blue-100 text-blue-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-200 transition flex items-center whitespace-nowrap"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="bg-red-100 text-red-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-200 transition flex items-center whitespace-nowrap"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </button>
        </div>
      ),
      ignoreRowClick: true,
      button: true,
      minWidth: "180px",
    },
  ], [products]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Header dan Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 border-b pb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 md:mb-0">Manajemen Produk</h1>
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
            <input 
              type="text" 
              placeholder="Cari produk..." 
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        
        {/* Kontainer untuk Tabel */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2 shadow-md"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Tambah Produk</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={filteredItems}
            pagination
            responsive
            striped
            highlightOnHover
            pointerOnHover
            className="rounded-lg overflow-hidden shadow-sm"
          />
        </div>
      </div>

      {/* Modal Tambah Produk */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Tambah Produk</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <XCircle className="w-7 h-7" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <input
                type="text"
                name="nama"
                value={newProduct.nama}
                onChange={handleAddChange}
                placeholder="Nama Produk"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
              <input
                type="text"
                name="jenis"
                value={newProduct.jenis}
                onChange={handleAddChange}
                placeholder="Jenis Produk"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
              <input
                type="number"
                name="harga"
                value={newProduct.harga}
                onChange={handleAddChange}
                placeholder="Harga"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
              <textarea
                name="deskripsi"
                value={newProduct.deskripsi}
                onChange={handleAddChange}
                placeholder="Deskripsi"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                rows="4"
                required
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Produk */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Edit Produk</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <XCircle className="w-7 h-7" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1 text-gray-700">Nama Produk</label>
                <input
                  type="text"
                  name="nama"
                  value={editingProduct.nama}
                  onChange={handleEditChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-gray-700">Jenis</label>
                <input
                  type="text"
                  name="jenis"
                  value={editingProduct.jenis}
                  onChange={handleEditChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-gray-700">Harga</label>
                <input
                  type="number"
                  name="harga"
                  value={editingProduct.harga}
                  onChange={handleEditChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-gray-700">Deskripsi</label>
                <textarea
                  name="deskripsi"
                  value={editingProduct.deskripsi}
                  onChange={handleEditChange}
                  required
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
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
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm text-center">
            <div className="flex justify-center mb-4 text-red-500">
              <Trash2 size={48} />
            </div>
            <h2 className="text-xl font-bold mb-2">Konfirmasi Hapus</h2>
            <p className="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus produk ini?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Products;
