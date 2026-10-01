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
} from 'lucide-react'
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
  handleDeleteFeedback,  
  getFeedbackBadge,
  activePage,
  setActivePage,
}) {
  const isAdmin = String(user?.role || '').toLowerCase() === 'admin'

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
                Total {feedbacks.length} masukan
              </p>
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
          ) : (
            <div className="fb__list">
              {feedbacks.map((feedback, index) => {
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
                {/* JENIS */}
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

                {/* PENGIRIM */}
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

                {/* JUDUL */}
                <div className="fb__modal-block">
                  <span className="fb__modal-label">Judul</span>
                  <div className="fb__modal-title-value">
                    {selectedFeedback.title || '-'}
                  </div>
                </div>

                {/* ISI */}
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
  // FORM SARAN & MASUKAN
  // =====================================================

  return (
    <div className="fb">
      {/* HEADER */}
      <div className="fb__header">
        <div>
          <h1 className="fb__title">Saran & Masukan</h1>
          <p className="fb__subtitle">
            Bantu kami meningkatkan PENINK dengan memberikan saran,
            masukan, atau melaporkan kendala.
          </p>
        </div>
      </div>

      {/* FORM CARD */}
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
          {feedbackSuccess && (
            <div className="fb__alert fb__alert--success">
              <CheckCircle2 size={16} />
              <span>{feedbackSuccess}</span>
            </div>
          )}

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

            {isAdmin && (
              <button
                type="button"
                className="fb__btn-secondary fb__btn-secondary--solid"
                onClick={handleLoadFeedbacks}
                disabled={feedbackLoading}
              >
                <List size={14} />
                {feedbackLoading ? 'Memuat...' : 'Lihat Saran & Masukan'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default Feedback