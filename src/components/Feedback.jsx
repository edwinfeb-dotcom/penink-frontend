import { useState, useEffect } from 'react'
import {
  MessageSquare,
  Send,
  List,
  X,
  ArrowLeft,
  User as UserIcon,
  Building2,
  Calendar,
  Inbox,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Search,
} from 'lucide-react'
import SuccessCard from './SuccessCard'
import './Feedback.css'

function Feedback({
  user,
  feedbackType,
  setFeedbackType,
  feedbackTitle,
  setFeedbackTitle,
  feedbackMessage,
  setFeedbackMessage,
  feedbackSuccess,
  feedbackError,
  feedbacks,
  feedbackLoading,
  selectedFeedback,
  setSelectedFeedback,
  handleSubmitFeedback,
  handleLoadFeedbacks,
  loadFeedbacksData,
  handleDeleteFeedback,
  getFeedbackBadge,
  activePage,
  setActivePage,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showSuccessCard, setShowSuccessCard] = useState(false)

  const role = String(user?.role || '').toLowerCase()
  const isAdmin = 
  role === 'admin' || 
  role === 'super_admin' || 
  role === 'admin_unit'

  // Auto-load data feedback waktu halaman dibuka
  useEffect(() => {
    if (isAdmin && activePage === 'saran' && loadFeedbacksData) {
      loadFeedbacksData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage])

  // =====================================================
  // TAMPILKAN SUCCESS CARD KETIKA feedbackSuccess ADA
  // =====================================================
  useEffect(() => {
    if (feedbackSuccess) {
      setShowSuccessCard(true)
    }
  }, [feedbackSuccess])

  const filteredFeedbacks = feedbacks.filter((fb) => {
    const q = searchTerm.toLowerCase().trim()
    if (!q) return true
    return (
      fb.title?.toLowerCase().includes(q) ||
      fb.message?.toLowerCase().includes(q) ||
      fb.type?.toLowerCase().includes(q) ||
      fb.user?.name?.toLowerCase().includes(q) ||
      fb.user?.unit_kerja?.nama_unit_kerja?.toLowerCase().includes(q)
    )
  })

  // =====================================================
  // FEEDBACK LIST (untuk admin)
  // =====================================================

  if (activePage === 'feedback-list') {
    return (
      <div className="fb">
        <div className="fb__header">
          <div>
            <h1 className="fb__title">Saran & Masukan Pengguna</h1>
            <p className="fb__subtitle">
              Daftar saran, masukan, dan kendala yang dikirim pengguna PENINK.
            </p>
          </div>

          <button
            type="button"
            className="fb__btn-secondary"
            onClick={() => setActivePage('saran')}
          >
            <ArrowLeft size={14} /> Kembali
          </button>
        </div>

        <div className="fb__list-card">
          <div className="fb__list-header">
            <div>
              <h3 className="fb__list-title">Daftar Masukan</h3>
              <p className="fb__list-subtitle">
                {searchTerm
                  ? `Menampilkan ${filteredFeedbacks.length} dari ${feedbacks.length} masukan`
                  : `Total ${feedbacks.length} masukan`}
              </p>
            </div>

            <div className="fb__search">
              <Search size={16} className="fb__search-icon" />
              <input
                type="text"
                className="fb__search-input"
                placeholder="Cari judul, pengirim, unit kerja..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {feedbackLoading ? (
            <div className="fb__empty">Memuat data...</div>
          ) : feedbacks.length === 0 ? (
            <div className="fb__empty">
              <Inbox size={32} className="fb__empty-icon" />
              <strong>Belum ada masukan</strong>
              <p>Saran dan masukan dari pengguna bakal muncul di sini.</p>
            </div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className="fb__empty">
              <Search size={32} className="fb__empty-icon" />
              <strong>Masukan tidak ditemukan</strong>
              <p>Coba kata kunci lain.</p>
            </div>
          ) : (
            <div className="fb__list">
              {filteredFeedbacks.map((feedback, index) => {
                const badge = getFeedbackBadge(feedback.type)
                return (
                  <div key={feedback.id} className="fb__item">
                    <div className="fb__item-left">
                      <span className="fb__item-number">{index + 1}</span>

                      <div className="fb__item-info">
                        <div className="fb__item-top">
                          <span
                            className="fb__badge"
                            style={{
                              background: badge.background,
                              color: badge.color,
                            }}
                          >
                            {badge.label}
                          </span>
                          <strong className="fb__item-title">
                            {feedback.title}
                          </strong>
                        </div>

                        <div className="fb__item-meta">
                          <span className="fb__meta-item">
                            <UserIcon size={12} />
                            {feedback.user?.name || '-'}
                          </span>
                          <span className="fb__meta-item">
                            <Building2 size={12} />
                            {feedback.user?.unit_kerja?.nama_unit_kerja || '-'}
                          </span>
                          <span className="fb__meta-item">
                            <Calendar size={12} />
                            {new Date(
                              feedback.created_at
                            ).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="fb__item-actions">
                      <button
                        type="button"
                        className="fb__btn-small"
                        onClick={() => setSelectedFeedback(feedback)}
                      >
                        Lihat
                      </button>

                      <button
                        type="button"
                        className="fb__btn-small fb__btn-small--danger"
                        onClick={() => handleDeleteFeedback(feedback)}
                        title="Hapus"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* MODAL DETAIL */}
        {selectedFeedback && (
          <div
            className="fb__modal-backdrop"
            onClick={() => setSelectedFeedback(null)}
          >
            <div
              className="fb__modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="fb__modal-header">
                <div>
                  <h2 className="fb__modal-title">Detail Masukan</h2>
                  <p className="fb__modal-subtitle">
                    Informasi lengkap masukan pengguna.
                  </p>
                </div>
                <button
                  type="button"
                  className="fb__modal-close"
                  onClick={() => setSelectedFeedback(null)}
                  aria-label="Tutup"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="fb__modal-body">
                <div className="fb__modal-block">
                  <span className="fb__modal-label">Jenis</span>
                  {(() => {
                    const badge = getFeedbackBadge(selectedFeedback.type)
                    return (
                      <span
                        className="fb__badge fb__badge--lg"
                        style={{
                          background: badge.background,
                          color: badge.color,
                        }}
                      >
                        {badge.label}
                      </span>
                    )
                  })()}
                </div>

                <div className="fb__modal-block fb__modal-block--box">
                  <span className="fb__modal-label">Informasi Pengirim</span>
                  <div className="fb__modal-grid">
                    <div>
                      <span className="fb__modal-mini">Pengirim</span>
                      <strong>{selectedFeedback.user?.name || '-'}</strong>
                    </div>
                    <div>
                      <span className="fb__modal-mini">Tanggal</span>
                      <strong>
                        {new Date(
                          selectedFeedback.created_at
                        ).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </strong>
                    </div>
                    <div className="fb__modal-full">
                      <span className="fb__modal-mini">Unit Kerja</span>
                      <strong>
                        {selectedFeedback.user?.unit_kerja?.nama_unit_kerja ||
                          '-'}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="fb__modal-block">
                  <span className="fb__modal-label">Judul</span>
                  <div className="fb__modal-title-value">
                    {selectedFeedback.title || '-'}
                  </div>
                </div>

                <div className="fb__modal-block">
                  <span className="fb__modal-label">Isi Masukan</span>
                  <div className="fb__modal-message">
                    {selectedFeedback.message || '-'}
                  </div>
                </div>
              </div>

              <div className="fb__modal-footer">
                <button
                  type="button"
                  className="fb__btn-secondary"
                  onClick={() => setSelectedFeedback(null)}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // =====================================================
  // ADMIN VIEW — DASHBOARD OVERVIEW
  // =====================================================

  if (isAdmin) {
    const totalFeedback = feedbacks.length

    const countByType = (type) =>
      feedbacks.filter((fb) => fb.type === type).length

    const recentFeedbacks = [...feedbacks]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)

    const statCards = [
      {
        label: 'Total Masukan',
        value: totalFeedback,
        color: 'blue',
      },
      {
        label: 'Saran',
        value: countByType('saran'),
        color: 'green',
      },
      {
        label: 'Masukan',
        value: countByType('masukan'),
        color: 'orange',
      },
      {
        label: 'Kendala',
        value: countByType('kendala'),
        color: 'red',
      },
    ]

    return (
      <div className="fb">
        <div className="fb__header">
          <div>
            <h1 className="fb__title">Saran & Masukan</h1>
            <p className="fb__subtitle">
              Kelola saran, masukan, dan kendala dari pengguna PENINK.
            </p>
          </div>

          <button
            type="button"
            className="fb__btn-primary"
            onClick={loadFeedbacksData}
            disabled={feedbackLoading}
          >
            <List size={14} />
            {feedbackLoading ? 'Memuat...' : 'Muat Data'}
          </button>
        </div>

        <div className="fb__stats">
          {statCards.map((card, idx) => (
            <div
              key={idx}
              className={`fb-stat fb-stat--${card.color}`}
            >
              <span className="fb-stat__label">{card.label}</span>
              <span className="fb-stat__value">{card.value}</span>
            </div>
          ))}
        </div>

        <div className="fb__list-card">
          <div className="fb__list-header">
            <div>
              <h3 className="fb__list-title">Masukan Terbaru</h3>
              <p className="fb__list-subtitle">
                {totalFeedback > 0
                  ? `Menampilkan ${recentFeedbacks.length} dari ${totalFeedback} masukan`
                  : 'Belum ada masukan'}
              </p>
            </div>

            {totalFeedback > 0 && (
              <button
                type="button"
                className="fb__btn-secondary fb__btn-secondary--solid"
                onClick={handleLoadFeedbacks}
              >
                Lihat Semua →
              </button>
            )}
          </div>

          {totalFeedback === 0 ? (
            <div className="fb__empty">
              <Inbox size={32} className="fb__empty-icon" />
              <strong>Belum ada masukan</strong>
              <p>
                Klik tombol <b>Muat Data</b> di atas untuk mengambil
                masukan pengguna.
              </p>
            </div>
          ) : (
            <div className="fb__list">
              {recentFeedbacks.map((feedback, index) => {
                const badge = getFeedbackBadge(feedback.type)
                return (
                  <div key={feedback.id} className="fb__item">
                    <div className="fb__item-left">
                      <span className="fb__item-number">{index + 1}</span>

                      <div className="fb__item-info">
                        <div className="fb__item-top">
                          <span
                            className="fb__badge"
                            style={{
                              background: badge.background,
                              color: badge.color,
                            }}
                          >
                            {badge.label}
                          </span>
                          <strong className="fb__item-title">
                            {feedback.title}
                          </strong>
                        </div>

                        <div className="fb__item-meta">
                          <span className="fb__meta-item">
                            <UserIcon size={12} />
                            {feedback.user?.name || '-'}
                          </span>
                          <span className="fb__meta-item">
                            <Calendar size={12} />
                            {new Date(
                              feedback.created_at
                            ).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="fb__btn-small"
                      onClick={() => setSelectedFeedback(feedback)}
                    >
                      Lihat
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* MODAL DETAIL */}
        {selectedFeedback && (
          <div
            className="fb__modal-backdrop"
            onClick={() => setSelectedFeedback(null)}
          >
            <div
              className="fb__modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="fb__modal-header">
                <div>
                  <h2 className="fb__modal-title">Detail Masukan</h2>
                  <p className="fb__modal-subtitle">
                    Informasi lengkap masukan pengguna.
                  </p>
                </div>
                <button
                  type="button"
                  className="fb__modal-close"
                  onClick={() => setSelectedFeedback(null)}
                  aria-label="Tutup"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="fb__modal-body">
                <div className="fb__modal-block">
                  <span className="fb__modal-label">Jenis</span>
                  {(() => {
                    const badge = getFeedbackBadge(selectedFeedback.type)
                    return (
                      <span
                        className="fb__badge fb__badge--lg"
                        style={{
                          background: badge.background,
                          color: badge.color,
                        }}
                      >
                        {badge.label}
                      </span>
                    )
                  })()}
                </div>

                <div className="fb__modal-block fb__modal-block--box">
                  <span className="fb__modal-label">Informasi Pengirim</span>
                  <div className="fb__modal-grid">
                    <div>
                      <span className="fb__modal-mini">Pengirim</span>
                      <strong>{selectedFeedback.user?.name || '-'}</strong>
                    </div>
                    <div>
                      <span className="fb__modal-mini">Tanggal</span>
                      <strong>
                        {new Date(
                          selectedFeedback.created_at
                        ).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </strong>
                    </div>
                    <div className="fb__modal-full">
                      <span className="fb__modal-mini">Unit Kerja</span>
                      <strong>
                        {selectedFeedback.user?.unit_kerja?.nama_unit_kerja ||
                          '-'}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="fb__modal-block">
                  <span className="fb__modal-label">Judul</span>
                  <div className="fb__modal-title-value">
                    {selectedFeedback.title || '-'}
                  </div>
                </div>

                <div className="fb__modal-block">
                  <span className="fb__modal-label">Isi Masukan</span>
                  <div className="fb__modal-message">
                    {selectedFeedback.message || '-'}
                  </div>
                </div>
              </div>

              <div className="fb__modal-footer">
                <button
                  type="button"
                  className="fb__btn-secondary"
                  onClick={() => setSelectedFeedback(null)}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // =====================================================
  // USER VIEW — FORM KIRIM MASUKAN
  // =====================================================

  return (
    <div className="fb">
      {/* SUCCESS CARD MODAL */}
      {showSuccessCard && (
        <SuccessCard
          title="Berhasil Terkirim!"
          message="Terima kasih sudah mengirim saran. Masukan Anda akan kami tindak lanjuti secepatnya."
          emoji="🎉"
          primaryButtonText="Kirim Pesan Lain"
          onPrimaryClick={() => {
            setShowSuccessCard(false)
            setFeedbackTitle('')
            setFeedbackMessage('')
            setFeedbackType('saran')
          }}
          onClose={() => setShowSuccessCard(false)}
        />
      )}

      <div className="fb__header">
        <div>
          <h1 className="fb__title">Saran & Masukan</h1>
          <p className="fb__subtitle">
            Bantu kami meningkatkan PENINK dengan memberikan saran,
            masukan, atau melaporkan kendala.
          </p>
        </div>
      </div>

      <form className="fb__form-card" onSubmit={handleSubmitFeedback}>
        <div className="fb__form-header">
          <div className="fb__form-icon">
            <MessageSquare size={20} />
          </div>
          <div>
            <h3 className="fb__form-title">Kirim Masukan</h3>
            <p className="fb__form-subtitle">
              Masukan kamu akan membantu kami memperbaiki layanan.
            </p>
          </div>
        </div>

        <div className="fb__form-body">
          {feedbackError && (
            <div className="fb__alert fb__alert--error">
              <AlertCircle size={16} />
              <span>{feedbackError}</span>
            </div>
          )}

          <div className="fb__field">
            <label>Jenis Masukan</label>
            <select
              className="fb__input"
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
            >
              <option value="saran">Saran</option>
              <option value="masukan">Masukan</option>
              <option value="kendala">Kendala</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>

          <div className="fb__field">
            <label>Judul</label>
            <input
              className="fb__input"
              type="text"
              placeholder="Masukkan judul masukan"
              value={feedbackTitle}
              onChange={(e) => setFeedbackTitle(e.target.value)}
            />
          </div>

          <div className="fb__field">
            <label>Saran / Masukan</label>
            <textarea
              className="fb__input fb__input--textarea"
              rows={6}
              placeholder="Tuliskan saran atau masukan Anda..."
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
            />
          </div>

          <div className="fb__form-actions">
            <button type="submit" className="fb__btn-primary">
              <Send size={14} />
              Kirim Masukan
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Feedback