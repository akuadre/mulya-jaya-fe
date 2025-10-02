
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

const icons = {
  success: <CheckCircle className="w-6 h-6 text-green-500" />,
  error: <XCircle className="w-6 h-6 text-red-500" />,
  warning: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
  info: <Info className="w-6 h-6 text-gray-800" />,
};

// Hook kustom untuk mengelola notifikasi
export const useNotification = () => {
    const [notification, setNotification] = useState(null);

    const showNotification = useCallback((message, type = 'info') => {
        const id = Date.now();
        setNotification({ id, message, type });
        setTimeout(() => {
            setNotification(prev => (prev?.id === id ? null : prev));
        }, 3000); // Otomatis hilang setelah 3 detik
    }, []);
    
    const dismissNotification = useCallback(() => {
        setNotification(null);
    }, []);

    return { notification, showNotification, dismissNotification };
};


/**
 * Komponen untuk menampilkan notifikasi "toast".
 * @param {object} props - Props untuk komponen.
 * @param {object|null} props.notification - Objek notifikasi dari hook useNotification.
 * @param {function} props.onDismiss - Fungsi untuk menghilangkan notifikasi.
 * @example
 * // Di komponen App.jsx
 * const { notification, showNotification, dismissNotification } = useNotification();
 * // ...
 * <Notification notification={notification} onDismiss={dismissNotification} />
 * // Untuk menampilkan: showNotification("Produk disimpan!", "success");
 */
const Notification = ({ notification, onDismiss }) => {
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999]">
      <AnimatePresence>
        {notification && (
          <motion.div
            layout
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-2xl border border-gray-200"
          >
            {icons[notification.type]}
            <span className="font-medium text-gray-800">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notification;
