import { useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom"; 

const Products = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      no: 1,
      foto: "/images/kacamata.png",
      nama: "Dior",
      jenis: "Membaca",
      harga: 2000000,
      deskripsi: "Kacamata Dior edisi terbaru dengan kualitas premium dan desain elegan.",
    },
    {
      id: 2,
      no: 2,
      foto: "/images/kacamata.png",
      nama: "Chanel",
      jenis: "Fashion",
      harga: 3500000,
      deskripsi: "Kacamata Chanel modis untuk menunjang gaya fashion sehari-hari.",
    },
    {
      id: 3,
      no: 3,
      foto: "/images/kacamata.png",
      nama: "Gucci",
      jenis: "Aksesoris",
      harga: 1750000,
      deskripsi: "Kacamata Gucci klasik dengan material berkualitas tinggi.",
    },
  ]);

  const [filterText, setFilterText] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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
        foto: "/images/kacamata.png",
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
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      const updatedProducts = products.filter((p) => p.id !== id);
      setProducts(updatedProducts.map((p, index) => ({ ...p, no: index + 1 })));
    }
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
          className="w-20 h-20 object-cover rounded-md my-2"
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
            className="bg-green-200 text-green-700 font-semibold px-4 py-2 rounded-md hover:bg-green-300 transition flex items-center"
          >
            Edit
            <svg
              className="w-4 h-4 ml-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828zM4 14.5V17a1 1 0 001 1h2.5a1 1 0 00.707-.293l8-8-2.586-2.586-8 8A1 1 0 004 14.5z" />
            </svg>
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="bg-red-200 text-red-700 font-semibold px-4 py-2 rounded-md hover:bg-red-300 transition flex items-center"
          >
            Delete
            <svg
              className="w-4 h-4 ml-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 009 2zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      ),
      ignoreRowClick: true,
      button: true,
    },
  ], [products]);

  const SubHeaderComponent = useMemo(() => {
    return (
      <div className="flex justify-end w-full">
        <input
          type="text"
          placeholder="Cari produk..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>
    );
  }, [filterText]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manajemen Produk</h1>
      
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-xl">Current products</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center space-x-2"
          >
            <span>Tambah produk</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 011-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293-.293a1 1 0 000-1.414l-7-7z"></path>
            </svg>
          </button>
        </div>

        <DataTable
          columns={columns}
          data={filteredItems}
          pagination
          responsive
          striped
          highlightOnHover
          subHeader
          subHeaderComponent={SubHeaderComponent}
        />
      </div>

      {/* Modal Tambah Produk */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-white p-6 rounded-lg shadow w-96">
            <h2 className="text-lg font-bold mb-4">Tambah Produk</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <input
                type="text"
                name="nama"
                value={newProduct.nama}
                onChange={handleAddChange}
                placeholder="Nama Produk"
                className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
              <input
                type="text"
                name="jenis"
                value={newProduct.jenis}
                onChange={handleAddChange}
                placeholder="Jenis Produk"
                className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
              <input
                type="number"
                name="harga"
                value={newProduct.harga}
                onChange={handleAddChange}
                placeholder="Harga"
                className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
              <textarea
                name="deskripsi"
                value={newProduct.deskripsi}
                onChange={handleAddChange}
                placeholder="Deskripsi"
                className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
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
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <h2 className="text-xl font-bold mb-4">Edit Produk</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Nama Produk</label>
                <input
                  type="text"
                  name="nama"
                  value={editingProduct.nama}
                  onChange={handleEditChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Jenis</label>
                <input
                  type="text"
                  name="jenis"
                  value={editingProduct.jenis}
                  onChange={handleEditChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Harga</label>
                <input
                  type="number"
                  name="harga"
                  value={editingProduct.harga}
                  onChange={handleEditChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Deskripsi</label>
                <textarea
                  name="deskripsi"
                  value={editingProduct.deskripsi}
                  onChange={handleEditChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;