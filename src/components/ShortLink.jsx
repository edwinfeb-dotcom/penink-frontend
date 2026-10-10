import { useState } from 'react'
import {
  Plus,
  Link2,
  Copy,
  QrCode,
  Pencil,
  Trash2,
  Power,
  Download,
  X,
  Search,
  ExternalLink,
} from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
import './ShortLink.css'
import { useToast } from './Toast'
import NotificationModal from './NotificationModal' // <-- Tambahkan Import Ini

function ShortLink({
  user,
  API_URL,
  url, setUrl,
  title, setTitle,
  alias, setAlias,
  type, setType,
  loading,
  shortUrl,
  shortLinks,
  editingShortLink,
  editShortLinkForm,
  setEditShortLinkForm,
  editShortLinkLoading,
  editShortLinkError,
  shortenUrl,
  copyShortUrl,
  downloadQR,
  startEditShortLink,
  cancelEditShortLink,
  handleEditShortLink,
  handleToggleShortLink,
  handleDeleteShortLink,
}) {
  const toast = useToast()
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showQrId, setShowQrId] = useState(null)

  // STATE BARU: Untuk mengontrol Modal Konfirmasi
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: null
  })

  const filteredLinks = shortLinks.filter((link) => {
    const q = searchTerm.toLowerCase().trim()
    if (!q) return true
    return (
      link.title?.toLowerCase().includes(q) ||
      link.short_code?.toLowerCase().includes(q) ||
      link.original_url?.toLowerCase().includes(q)
    )
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    shortenUrl()
    setShowForm(false)
    
    // CATATAN UNTUK ERROR "ALIAS SUDAH DIGUNAKAN":
    // Karena fungsi shortenUrl() dieksekusi di App.jsx, kamu perlu memantau
    // state error dari sana. Jika di App.jsx ada state `shortenError`,
    // kamu bisa tambahkan useEffect di sini untuk memunculkan modal:
    //
    // useEffect(() => {
    //   if (shortenError === "Alias tersebut sudah digunakan") {
    //     setModalConfig({
    //       isOpen: true, type: 'warning',
    //       title: 'Alias Sudah Digunakan',
    //       message: 'Silakan pilih alias lain yang belum terdaftar.'
    //     })
    //   }
    // }, [shortenError])
  }

  // FUNGSI BARU: Konfirmasi Hapus Link
  const handleDeleteClick = (id) => {
    setModalConfig({
      isOpen: true,
      type: 'warning', // Emoji ⚠️
      title: 'Hapus Short Link',
      message: 'Apakah kamu yakin ingin menghapus short link ini? Tindakan ini tidak dapat dibatalkan.',
      onConfirm: () => {
        handleDeleteShortLink(id)
        setModalConfig(prev => ({ ...prev, isOpen: false }))
      }
    })
  }

  // FUNGSI BARU: Konfirmasi Aktif/Nonaktif Link
  const handleToggleClick = (id, currentStatus) => {
    setModalConfig({
      isOpen: true,
      type: 'info', // Emoji ℹ️
      title: currentStatus ? 'Nonaktifkan Short Link' : 'Aktifkan Short Link',
      message: currentStatus 
        ? 'Short link tidak akan bisa diakses sementara waktu.' 
        : 'Short link akan bisa diakses kembali oleh pengguna.',
      onConfirm: () => {
        handleToggleShortLink(id)
        setModalConfig(prev => ({ ...prev, isOpen: false }))
      }
    })
  }

  return (
    <div className="sl">

      {/* HEADER HALAMAN */}
      <div className="sl__header">
        <div className="sl__header-text">
          <h1 className="sl__title">Short Link</h1>
          <p className="sl__subtitle">
            Buat dan kelola short link kamu
          </p>
        </div>

        <button
          type="button"
          className="sl__btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          <span>{showForm ? 'Tutup' : 'Buat Short Link'}</span>
        </button>
      </div>

      {/* FORM BUAT SHORT LINK */}
      {showForm && (
        <form className="sl__form-card" onSubmit={handleSubmit}>
          <div className="sl__form-header">
            <div className="sl__form-icon">
              <Link2 size={20} />
            </div>
            <div>
              <h3 className="sl__form-title">Buat Short Link Baru</h3>
              <p className="sl__form-subtitle">
                Masukkan URL tujuan lalu bagikan link PENINK yang lebih singkat.
              </p>
            </div>
          </div>

          <div className="sl__form-body">
            <div className="sl__field">
              <label>URL Tujuan</label>
              <input
                className="sl__input"
                type="text"
                placeholder="https://contoh.go.id/halaman-panjang"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div className="sl__field-row">
              <div className="sl__field">
                <label>Judul Link (opsional)</label>
                <input
                  className="sl__input"
                  type="text"
                  placeholder="Judul link"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="sl__field">
                <label>Custom Alias (opsional)</label>
                <input
                  className="sl__input"
                  type="text"
                  placeholder="misalnya: ppdb2026"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="sl__submit"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Singkatkan URL'}
            </button>
          </div>
        </form>
      )}

      {/* HASIL SHORT URL */}
      {shortUrl && (
        <div className="sl__result-card">
          <div className="sl__result-header">
            <h3 className="sl__result-title">✓ Short Link Berhasil Dibuat</h3>
          </div>

          <div className="sl__result-body">
            <div className="sl__result-info">
              <span className="sl__result-label">Link Pendek</span>
              <a
                href={shortUrl}
                target="_blank"
                rel="noreferrer"
                className="sl__result-url"
              >
                {shortUrl}
              </a>

              <div className="sl__result-actions">
                <button
                  type="button"
                  className="sl__btn-secondary"
                  onClick={copyShortUrl}
                >
                  <Copy size={14} /> Salin Link
                </button>
                <button
                  type="button"
                  className="sl__btn-secondary"
                  onClick={() => downloadQR('code')}
                >
                  <Download size={14} /> Download QR
                </button>
              </div>
            </div>

            <div className="sl__qr-wrapper">
              <QRCodeCanvas
                id="qr-code"
                value={`${shortUrl}?source=qr`}
                size={400}
                level="H"
                bgColor="#ffffff"
                fgColor="#000000"
                includeMargin={true}
                imageSettings={{
                  src: '/Lambang_Kabupaten_Landak.png',
                  height: 80,
                  width: 68,
                  excavate: true,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* FORM EDIT */}
      {editingShortLink && (
        <form className="sl__form-card" onSubmit={handleEditShortLink}>
          <div className="sl__form-header">
            <div className="sl__form-icon">
              <Pencil size={20} />
            </div>
            <div>
              <h3 className="sl__form-title">Edit Short Link</h3>
              <p className="sl__form-subtitle">
                Perbarui data short link.
              </p>
            </div>
          </div>

          <div className="sl__form-body">
            <div className="sl__field">
              <label>URL Tujuan</label>
              <input
                className="sl__input"
                type="url"
                value={editShortLinkForm.original_url}
                onChange={(e) =>
                  setEditShortLinkForm({
                    ...editShortLinkForm,
                    original_url: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="sl__field-row">
              <div className="sl__field">
                <label>Custom Alias</label>
                <input
                  className="sl__input"
                  type="text"
                  value={editShortLinkForm.short_code}
                  onChange={(e) =>
                    setEditShortLinkForm({
                      ...editShortLinkForm,
                      short_code: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="sl__field">
                <label>Judul Link</label>
                <input
                  className="sl__input"
                  type="text"
                  value={editShortLinkForm.title}
                  onChange={(e) =>
                    setEditShortLinkForm({
                      ...editShortLinkForm,
                      title: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {editShortLinkError && (
              <div className="sl__error">{editShortLinkError}</div>
            )}

            <div className="sl__form-actions">
              <button
                type="button"
                className="sl__btn-secondary"
                onClick={cancelEditShortLink}
                disabled={editShortLinkLoading}
              >
                Batal
              </button>
              <button
                type="submit"
                className="sl__submit sl__submit--inline"
                disabled={editShortLinkLoading}
              >
                {editShortLinkLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* DAFTAR SHORT LINK */}
      <div className="sl__list-card">
        <div className="sl__list-header">
          <div>
            <h3 className="sl__list-title">Daftar Short Link</h3>
            <p className="sl__list-subtitle">
              Total {shortLinks.length} short link
            </p>
          </div>

          <div className="sl__search">
            <Search size={16} className="sl__search-icon" />
            <input
              type="text"
              className="sl__search-input"
              placeholder="Cari short link..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredLinks.length === 0 ? (
          <div className="sl__empty">
            <Link2 size={32} className="sl__empty-icon" />
            <strong>
              {shortLinks.length === 0
                ? 'Belum ada short link'
                : 'Short link tidak ditemukan'}
            </strong>
            <p>
              {shortLinks.length === 0
                ? 'Klik tombol "Buat Short Link" di atas untuk memulai.'
                : 'Coba kata kunci lain.'}
            </p>
          </div>
        ) : (
          <div className="sl__list">
            {filteredLinks.map((link) => (
              <div key={link.id} className="sl__item">
                <div className="sl__item-main">
                  <div className="sl__item-top">
                    <strong className="sl__item-title">
                      {link.title || 'Tanpa judul'}
                    </strong>
                    <span
                      className={`sl__badge ${
                        link.status ? 'sl__badge--active' : 'sl__badge--inactive'
                      }`}
                    >
                      {link.status ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>

                  <a
                    href={`${API_URL}/${link.short_code}`}
                    target="_blank"
                    rel="noreferrer"
                    className="sl__item-url"
                  >
                    {API_URL}/{link.short_code}
                    <ExternalLink size={12} />
                  </a>

                  <p className="sl__item-original">{link.original_url}</p>
                </div>

                <div className="sl__item-clicks">
                  <strong>{link.click_count ?? 0}</strong>
                  <span>klik</span>
                </div>

                <div className="sl__item-actions">
                  <button
                    type="button"
                    className="sl__icon-btn"
                    title="Edit"
                    onClick={() => startEditShortLink(link)}
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    type="button"
                    className="sl__icon-btn"
                    title="Copy"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${API_URL}/${link.short_code}`
                      )
                      toast.success('Link berhasil disalin')
                    }}
                  >
                    <Copy size={15} />
                  </button>

                  <button
                    type="button"
                    className="sl__icon-btn"
                    title="Tampilkan QR"
                    onClick={() =>
                      setShowQrId(showQrId === link.id ? null : link.id)
                    }
                  >
                    <QrCode size={15} />
                  </button>

                  {/* UBAH: Gunakan handleToggleClick untuk konfirmasi */}
                  <button
                    type="button"
                    className="sl__icon-btn"
                    title={link.status ? 'Nonaktifkan' : 'Aktifkan'}
                    onClick={() => handleToggleClick(link.id, link.status)}
                  >
                    <Power size={15} />
                  </button>

                  {/* UBAH: Gunakan handleDeleteClick untuk konfirmasi */}
                  <button
                    type="button"
                    className="sl__icon-btn sl__icon-btn--danger"
                    title="Hapus"
                    onClick={() => handleDeleteClick(link.id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {showQrId === link.id && (
                  <div className="sl__qr-popup">
                    <QRCodeCanvas
                      id={`qr-${link.id}`}
                      value={`${API_URL}/${link.short_code}?source=qr`}
                      size={400}
                      level="H"
                      imageSettings={{
                        src: '/Lambang_Kabupaten_Landak.png',
                        height: 80,
                        width: 68,
                        excavate: true,
                      }}
                    />
                    <button
                      type="button"
                      className="sl__btn-secondary"
                      onClick={() => downloadQR(link.id)}
                    >
                      <Download size={14} /> Download QR
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL KONFIRMASI (DITAMBAHKAN DI PALING BAWAH) */}
      <NotificationModal
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
      >
        {/* Tombol Kustom untuk Konfirmasi */}
        <button 
          className="btn-secondary-modal" 
          onClick={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        >
          Batal
        </button>
        <button 
          className="btn-primary-modal" 
          onClick={modalConfig.onConfirm}
        >
          Ya, Lanjutkan
        </button>
      </NotificationModal>

    </div>
  )
}

export default ShortLink