import React from 'react';
import './NotificationModal.css';

const NotificationModal = ({ 
  isOpen, 
  onClose, 
  type = 'info', 
  title = 'Informasi', 
  message = '', 
  children, // Untuk tombol kustom seperti "Batal" & "Ya, Ganti"
  closeOnOverlayClick = true 
}) => {
  // Jangan render apa-apa jika modal tidak terbuka
  if (!isOpen) return null;

  // Fungsi untuk menentukan Emoji dan Warna berdasarkan tipe
  const getIconConfig = () => {
    switch (type) {
      case 'error':
        return { emoji: '❌', bgColor: '#FEE2E2', textColor: '#DC2626' }; // Merah (Gagal)
      case 'warning':
        return { emoji: '⚠️', bgColor: '#FEF3C7', textColor: '#D97706' }; // Kuning (Peringatan)
      case 'success':
        return { emoji: '✅', bgColor: '#D1FAE5', textColor: '#059669' }; // Hijau (Sukses)
      case 'info':
      default:
        return { emoji: 'ℹ️', bgColor: '#DBEAFE', textColor: '#2563EB' }; // Biru (Info)
    }
  };

  const { emoji, bgColor, textColor } = getIconConfig();

  // Handler untuk klik overlay (area luar modal)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" role="dialog" aria-modal="true">
        
        {/* Tombol Tutup (X) */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Tutup">
          &times;
        </button>

        {/* Ikon Dinamis */}
        <div 
          className="modal-icon-wrapper" 
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          <span className="modal-emoji" role="img" aria-label={type}>
            {emoji}
          </span>
        </div>

        {/* Judul dan Pesan */}
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>

        {/* Area Tombol Aksi */}
        <div className="modal-actions">
          {children ? (
            children // Jika ada tombol kustom (seperti di Gambar 2), tampilkan itu
          ) : (
            <button className="btn-primary-modal" onClick={onClose}>
              Tutup
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;