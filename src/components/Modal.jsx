import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Komponen modal yang dapat digunakan kembali dengan animasi.
 * @param {object} props - Props untuk komponen.
 * @param {boolean} props.isOpen - State untuk menampilkan atau menyembunyikan modal.
 * @param {function} props.onClose - Fungsi yang dipanggil saat modal ditutup.
 * @param {string} props.title - Judul yang ditampilkan di header modal.
 * @param {React.ReactNode} props.children - Konten utama dari modal.
 * @param {React.ReactNode} [props.footer] - Konten opsional untuk footer modal (biasanya untuk tombol aksi).
 * @example
 * <Modal
 * isOpen={isModalOpen}
 * onClose={() => setIsModalOpen(false)}
 * title="Tambah Produk Baru"
 * footer={
 * <div className="flex justify-end gap-3">
 * <button onClick={handleClose} className="btn-secondary">Batal</button>
 * <button onClick={handleSubmit} className="btn-primary">Simpan</button>
 * </div>
 * }
 * >
 * <p>Konten form atau informasi diletakkan di sini.</p>
 * </Modal>
 */
const Modal = ({ isOpen, onClose, title, children, footer }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">{title}</h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                aria-label="Tutup modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {children}
            </div>
            
            {/* Modal Footer (Opsional) */}
            {footer && (
              <div className="p-5 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
