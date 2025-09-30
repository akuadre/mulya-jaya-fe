import React from 'react';

/**
 * Komponen input yang dapat digunakan kembali dengan styling yang konsisten.
 * @param {object} props - Props untuk komponen.
 * @param {string} props.label - Teks label untuk input.
 * @param {string} props.id - ID unik untuk input dan label.
 * @param {string} [props.type="text"] - Tipe input (text, email, password, etc.).
 * @param {any} [props....] - Props lain yang akan diteruskan ke elemen input.
 * @example
 * <FormInput
 * label="Nama Produk"
 * id="productName"
 * type="text"
 * placeholder="Masukkan nama produk..."
 * value={productName}
 * onChange={(e) => setProductName(e.target.value)}
 * required
 * />
 */
const FormInput = ({ label, id, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <input
        id={id}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
        {...props}
      />
    </div>
  );
};

export default FormInput;
