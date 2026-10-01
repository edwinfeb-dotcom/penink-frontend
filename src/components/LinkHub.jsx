import { useState } from 'react'
import {
  Plus,
  FolderKanban,
  Pencil,
  Trash2,
  Power,
  QrCode,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Download,
  X,
  Link2,
  ArrowUp,
  ArrowDown,
  Lightbulb,
} from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
import './LinkHub.css'

function LinkHub({
  linkHubs,
  linkHubLoading,
  linkHubError,
  showLinkHubForm,
  setShowLinkHubForm,
  linkHubForm,
  setLinkHubForm,
  editingLinkHub,
  editLinkHubForm,
  setEditLinkHubForm,
  editLinkHubLoading,
  editLinkHubError,
  selectedHub,
  setSelectedHub,
  showHubQr,
  setShowHubQr,
  linkItemForm,
  setLinkItemForm,
  editingLinkItem,
  setEditingLinkItem,
  linkItemLoading,
  linkItemError,
  setLinkItemError,
  createLinkHub,
  startEditLinkHub,
  setEditingLinkHub,
  setEditLinkHubError,
  handleUpdateLinkHub,
  handleDeleteLinkHub,
  toggleLinkHubStatus,
  addLinkItem,
  editLinkItem,
  deleteLinkItem,
  moveLinkItem,
  toggleLinkItemStatus,
}) {
  const [showInfo, setShowInfo] = useState(true)

  const handleToggleHub = (hub) => {
    if (selectedHub?.id === hub.id) {
      setSelectedHub(null)
      setLinkItemError('')
      setEditingLinkItem(null)
      setLinkItemForm({ title: '', url: '' })
    } else {
      setSelectedHub(hub)
      setLinkItemError('')
      setLinkItemForm({ title: '', url: '' })
      setEditingLinkItem(null)
    }
  }

  return (
    <div className="lh">

      {/* HEADER HALAMAN */}
      <div className="lh__header">
        <div className="lh__header-text">
          <h1 className="lh__title">Link Hub</h1>
          <p className="lh__subtitle">
            Kumpulan link dalam satu halaman
          </p>
        </div>

        <button
          type="button"
          className="lh__btn-primary"
          onClick={() => {
            setShowLinkHubForm(!showLinkHubForm)
            setEditingLinkHub(null)
          }}
        >
          {showLinkHubForm ? <X size={16} /> : <Plus size={16} />}
          <span>{showLinkHubForm ? 'Tutup' : 'Buat Link Hub'}</span>
        </button>
      </div>

      {showInfo && (
  <div className="lh__info">
    {/* DEKORASI BACKGROUND */}
    <div className="lh__info-deco" aria-hidden="true">
      <Link2 size={80} className="lh__info-deco-icon lh__info-deco-icon--1" />
      <FolderKanban size={120} className="lh__info-deco-icon lh__info-deco-icon--2" />
      <ExternalLink size={70} className="lh__info-deco-icon lh__info-deco-icon--3" />
      <QrCode size={90} className="lh__info-deco-icon lh__info-deco-icon--4" />
    </div>

    <div className="lh__info-icon">
       <Lightbulb size={22} />
    </div>
    <div className="lh__info-content">
      <strong>Apa itu Link Hub?</strong>
      <p>
        Link Hub memungkinkan Anda mengumpulkan beberapa tautan penting
        dalam satu halaman. Bagikan satu link untuk mengakses berbagai
        informasi — website, media sosial, layanan publik, dan lainnya.
      </p>
    </div>
    <button
      type="button"
      className="lh__info-close"
      onClick={() => setShowInfo(false)}
      aria-label="Tutup info"
    >
      <X size={16} />
    </button>
  </div>
)}

      {/* FORM BUAT LINK HUB */}
      {showLinkHubForm && (
        <form className="lh__form-card" onSubmit={createLinkHub}>
          <div className="lh__form-header">
            <div className="lh__form-icon">
              <FolderKanban size={20} />
            </div>
            <div>
              <h3 className="lh__form-title">Buat Link Hub Baru</h3>
              <p className="lh__form-subtitle">
                Buat halaman yang berisi kumpulan link.
              </p>
            </div>
          </div>

          <div className="lh__form-body">
            {linkHubError && (
              <div className="lh__error">{linkHubError}</div>
            )}

            <div className="lh__field">
              <label>Judul Link Hub</label>
              <input
                className="lh__input"
                type="text"
                placeholder="Contoh: Diskominfo Kabupaten Landak"
                value={linkHubForm.title}
                onChange={(e) =>
                  setLinkHubForm({ ...linkHubForm, title: e.target.value })
                }
                required
              />
            </div>

            <div className="lh__field">
              <label>Deskripsi</label>
              <textarea
                className="lh__input lh__input--textarea"
                placeholder="Deskripsi Link Hub (opsional)"
                rows={3}
                value={linkHubForm.description}
                onChange={(e) =>
                  setLinkHubForm({
                    ...linkHubForm,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="lh__field">
              <label>Alias Link Hub</label>
              <input
                className="lh__input"
                type="text"
                placeholder="Contoh: diskominfo"
                value={linkHubForm.short_code}
                onChange={(e) =>
                  setLinkHubForm({
                    ...linkHubForm,
                    short_code: e.target.value,
                  })
                }
                required
              />
              <small className="lh__hint">
                Link publik: /{linkHubForm.short_code || 'alias'}
              </small>
            </div>

            <div className="lh__form-actions">
              <button
                type="button"
                className="lh__btn-secondary"
                onClick={() => {
                  setShowLinkHubForm(false)
                  setLinkHubForm({ title: '', description: '', short_code: '' })
                }}
              >
                Batal
              </button>
              <button
                type="submit"
                className="lh__submit"
                disabled={linkHubLoading}
              >
                {linkHubLoading ? 'Menyimpan...' : 'Buat Link Hub'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* FORM EDIT LINK HUB */}
      {editingLinkHub && (
        <form
          className="lh__form-card lh__form-card--edit"
          onSubmit={(e) => {
            e.preventDefault()
            handleUpdateLinkHub()
          }}
        >
          <div className="lh__form-header">
            <div className="lh__form-icon lh__form-icon--edit">
              <Pencil size={20} />
            </div>
            <div>
              <h3 className="lh__form-title">Edit Link Hub</h3>
              <p className="lh__form-subtitle">
                Perbarui informasi Link Hub.
              </p>
            </div>
          </div>

          <div className="lh__form-body">
            {editLinkHubError && (
              <div className="lh__error">{editLinkHubError}</div>
            )}

            <div className="lh__field">
              <label>Judul</label>
              <input
                className="lh__input"
                type="text"
                value={editLinkHubForm.title}
                onChange={(e) =>
                  setEditLinkHubForm({
                    ...editLinkHubForm,
                    title: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="lh__field">
              <label>Deskripsi</label>
              <textarea
                className="lh__input lh__input--textarea"
                rows={3}
                value={editLinkHubForm.description}
                onChange={(e) =>
                  setEditLinkHubForm({
                    ...editLinkHubForm,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="lh__field">
              <label>Alias</label>
              <input
                className="lh__input"
                type="text"
                value={editLinkHubForm.short_code}
                onChange={(e) =>
                  setEditLinkHubForm({
                    ...editLinkHubForm,
                    short_code: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="lh__form-actions">
              <button
                type="button"
                className="lh__btn-secondary"
                onClick={() => {
                  setEditingLinkHub(null)
                  setEditLinkHubForm({
                    title: '',
                    description: '',
                    short_code: '',
                  })
                  setEditLinkHubError('')
                }}
                disabled={editLinkHubLoading}
              >
                Batal
              </button>
              <button
                type="submit"
                className="lh__submit"
                disabled={editLinkHubLoading}
              >
                {editLinkHubLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* DAFTAR LINK HUB */}
      <div className="lh__list-card">
        <div className="lh__list-header">
          <div>
            <h3 className="lh__list-title">Daftar Link Hub</h3>
            <p className="lh__list-subtitle">
              Total {linkHubs.length} Link Hub
            </p>
          </div>
        </div>

        {linkHubLoading && !showLinkHubForm ? (
          <div className="lh__empty">Memuat data...</div>
        ) : linkHubs.length === 0 ? (
          <div className="lh__empty">
            <FolderKanban size={32} className="lh__empty-icon" />
            <strong>Belum ada Link Hub</strong>
            <p>
              Klik tombol <b>+ Buat Link Hub</b> di atas untuk membuat
              Link Hub pertama.
            </p>
          </div>
        ) : (
          <div className="lh__list">
            {linkHubs.map((hub) => {
              const isOpen = selectedHub?.id === hub.id
              const showQr = showHubQr?.id === hub.id
              const itemCount = hub.items?.length || 0

              return (
                <div key={hub.id} className="lh__item">
                  <div className="lh__item-header">
                    <div className="lh__item-main">
                      <div className="lh__item-top">
                        <strong className="lh__item-title">
                          {hub.title}
                        </strong>
                        <span
                          className={`lh__badge ${
                            hub.status
                              ? 'lh__badge--active'
                              : 'lh__badge--inactive'
                          }`}
                        >
                          {hub.status ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </div>

                      {hub.description && (
                        <p className="lh__item-desc">{hub.description}</p>
                      )}

                      <a
                        href={`/${hub.short_code}`}
                        target="_blank"
                        rel="noreferrer"
                        className="lh__item-url"
                      >
                        {window.location.origin}/{hub.short_code}
                        <ExternalLink size={12} />
                      </a>
                    </div>

                    <div className="lh__item-meta">
                      <div className="lh__meta-item">
                        <strong>{itemCount}</strong>
                        <span>link</span>
                      </div>
                    </div>
                  </div>

                  <div className="lh__item-actions">
                    <button
                      type="button"
                      className={`lh__btn-action ${
                        isOpen ? 'lh__btn-action--active' : ''
                      }`}
                      onClick={() => handleToggleHub(hub)}
                    >
                      {isOpen ? (
                        <>
                          <ChevronUp size={14} /> Tutup
                        </>
                      ) : (
                        <>
                          <Plus size={14} /> Kelola Link
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="lh__btn-action"
                      onClick={() => startEditLinkHub(hub)}
                    >
                      <Pencil size={14} /> Edit
                    </button>

                    <button
                      type="button"
                      className="lh__btn-action"
                      onClick={() =>
                        setShowHubQr(showQr ? false : { id: hub.id })
                      }
                    >
                      <QrCode size={14} /> QR
                    </button>

                    <button
                      type="button"
                      className="lh__btn-action"
                      onClick={() => toggleLinkHubStatus(hub)}
                    >
                      <Power size={14} />
                      {hub.status ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>

                    <button
                      type="button"
                      className="lh__btn-action lh__btn-action--danger"
                      onClick={() => handleDeleteLinkHub(hub)}
                    >
                      <Trash2 size={14} /> Hapus
                    </button>
                  </div>

                  {/* QR */}
                  {showQr && (
                    <div className="lh__qr-wrapper">
                      <QRCodeCanvas
                        value={`${window.location.origin}/${hub.short_code}`}
                        size={160}
                        level="H"
                        includeMargin={true}
                        data-hub-id={hub.id}
                        imageSettings={{
                          src: '/Lambang_Kabupaten_Landak.png',
                          height: 36,
                          width: 30,
                          excavate: true,
                        }}
                      />
                      <button
                        type="button"
                        className="lh__btn-secondary"
                        onClick={() => {
                          const canvas = document.querySelector(
                            `canvas[data-hub-id="${hub.id}"]`
                          )
                          if (!canvas) return
                          const link = document.createElement('a')
                          link.download = `QR-LinkHub-${hub.short_code}.png`
                          link.href = canvas.toDataURL('image/png')
                          link.click()
                        }}
                      >
                        <Download size={14} /> Download QR
                      </button>
                    </div>
                  )}

                  {/* DAFTAR LINK DI DALAM HUB */}
                  {isOpen && (
                    <div className="lh__inner">
                      <div className="lh__inner-header">
                        <h4 className="lh__inner-title">
                          {editingLinkItem ? 'Edit Link' : 'Tambah Link'}
                        </h4>
                      </div>

                      {linkItemError && (
                        <div className="lh__error">{linkItemError}</div>
                      )}

                      <form
                        className="lh__inner-form"
                        onSubmit={
                          editingLinkItem
                            ? (e) =>
                                editLinkItem(e, hub.id, editingLinkItem.id)
                            : addLinkItem
                        }
                      >
                        <div className="lh__field-row">
                          <div className="lh__field">
                            <label>Judul Link</label>
                            <input
                              className="lh__input"
                              type="text"
                              placeholder="Contoh: Website Resmi"
                              value={linkItemForm.title}
                              onChange={(e) =>
                                setLinkItemForm({
                                  ...linkItemForm,
                                  title: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          <div className="lh__field">
                            <label>URL</label>
                            <input
                              className="lh__input"
                              type="url"
                              placeholder="https://contoh.com"
                              value={linkItemForm.url}
                              onChange={(e) =>
                                setLinkItemForm({
                                  ...linkItemForm,
                                  url: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                        </div>

                        <div className="lh__form-actions">
                          {editingLinkItem ? (
                            <button
                              type="button"
                              className="lh__btn-secondary"
                              onClick={() => {
                                setEditingLinkItem(null)
                                setLinkItemForm({ title: '', url: '' })
                              }}
                            >
                              Batal
                            </button>
                          ) : null}
                          <button
                            type="submit"
                            className="lh__submit lh__submit--inline"
                            disabled={linkItemLoading}
                          >
                            {linkItemLoading
                              ? 'Menyimpan...'
                              : editingLinkItem
                              ? 'Simpan Perubahan'
                              : 'Tambah Link'}
                          </button>
                        </div>
                      </form>

                      <div className="lh__inner-list">
                        <h4 className="lh__inner-title">
                          Daftar Link ({itemCount})
                        </h4>

                        {itemCount === 0 ? (
                          <p className="lh__inner-empty">
                            Belum ada link. Tambahkan link pertama.
                          </p>
                        ) : (
                          [...(hub.items || [])]
                            .sort((a, b) => a.sort_order - b.sort_order)
                            .map((item) => (
                              <div key={item.id} className="lh__link-row">
                                <div className="lh__link-info">
                                  <div className="lh__link-top">
                                    <strong>{item.title}</strong>
                                    <span
                                      className={`lh__badge ${
                                        item.status
                                          ? 'lh__badge--active'
                                          : 'lh__badge--inactive'
                                      }`}
                                    >
                                      {item.status ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                  </div>
                                  <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="lh__link-url"
                                  >
                                    {item.url}
                                  </a>
                                </div>

                                <div className="lh__link-actions">
                                  <button
                                    type="button"
                                    className="lh__icon-btn"
                                    title="Naik"
                                    onClick={() =>
                                      moveLinkItem(hub.id, item.id, 'up')
                                    }
                                  >
                                    <ArrowUp size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    className="lh__icon-btn"
                                    title="Turun"
                                    onClick={() =>
                                      moveLinkItem(hub.id, item.id, 'down')
                                    }
                                  >
                                    <ArrowDown size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    className="lh__icon-btn"
                                    title="Toggle Status"
                                    onClick={() =>
                                      toggleLinkItemStatus(hub.id, item.id)
                                    }
                                  >
                                    <Power size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    className="lh__icon-btn"
                                    title="Edit"
                                    onClick={() => {
                                      setEditingLinkItem(item)
                                      setLinkItemForm({
                                        title: item.title,
                                        url: item.url,
                                      })
                                    }}
                                  >
                                    <Pencil size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    className="lh__icon-btn lh__icon-btn--danger"
                                    title="Hapus"
                                    onClick={() =>
                                      deleteLinkItem(hub.id, item.id)
                                    }
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default LinkHub