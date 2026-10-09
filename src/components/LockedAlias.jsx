import { useState, useEffect, useMemo } from 'react'
import {
  Shield,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Lock,
  X,
} from 'lucide-react'
import './LockedAlias.css'
import { useConfirm } from './ConfirmModal'


function LockedAlias({ API_URL, user, unitKerjas }) {
  const confirm = useConfirm()
  const [aliases, setAliases] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [formAlias, setFormAlias] = useState('')
  const [formUnitKerja, setFormUnitKerja] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')

  // State untuk searchable unit kerja dropdown
  const [unitKerjaSearch, setUnitKerjaSearch] = useState('')
  const [showUnitKerjaDropdown, setShowUnitKerjaDropdown] = useState(false)

  // =====================================================
  // FILTER & SORT UNIT KERJA
  // =====================================================
  const filteredUnitKerjas = useMemo(() => {
    const sorted = [...unitKerjas].sort((a, b) =>
      a.nama_unit_kerja.localeCompare(b.nama_unit_kerja, 'id', {
        sensitivity: 'base',
      })
    )

    const search = unitKerjaSearch.trim().toLowerCase().replace(/\s+/g, '')
    if (!search) return sorted

    const exactMatches = []
    const fuzzyMatches = []

    for (const unit of sorted) {
      const compact = unit.nama_unit_kerja.toLowerCase().replace(/\s+/g, '')

      if (compact.includes(search)) {
        exactMatches.push(unit)
        continue
      }

      // Fuzzy match: huruf search berurutan di nama
      let i = 0
      for (const char of compact) {
        if (char === search[i]) i++
        if (i === search.length) break
      }
      if (i === search.length) {
        fuzzyMatches.push(unit)
      }
    }

    return [...exactMatches, ...fuzzyMatches]
  }, [unitKerjas, unitKerjaSearch])

  // =====================================================
  // FETCH DATA
  // =====================================================

  const fetchAliases = async () => {
    try {
      setLoading(true)
      setError('')

      const token = localStorage.getItem('token')

      const response = await fetch(
        `${API_URL}/api/admin/super/locked-aliases`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result.message || 'Gagal mengambil data alias.'
        )
      }

      setAliases(result.data || [])
    } catch (err) {
      console.error('FETCH ALIASES ERROR:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAliases()
  }, [])

  // =====================================================
  // TAMBAH ALIAS
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formAlias.trim()) {
      setFormError('Alias wajib diisi.')
      return
    }

    if (!formUnitKerja) {
      setFormError('Unit kerja wajib dipilih.')
      return
    }

    try {
      setFormLoading(true)
      setFormError('')

      const token = localStorage.getItem('token')

      const response = await fetch(
        `${API_URL}/api/admin/super/locked-aliases`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            alias: formAlias.trim().toLowerCase(),
            unit_kerja_id: formUnitKerja,
          }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        const errMsg = result.errors
          ? Object.values(result.errors).flat().join(' ')
          : result.message

        throw new Error(errMsg || 'Gagal mengunci alias.')
      }

      setAliases((prev) => [result.data, ...prev])
      setFormAlias('')
      setFormUnitKerja('')
      setUnitKerjaSearch('')
      setShowForm(false)
      setSuccess('Alias berhasil dikunci.')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setFormLoading(false)
    }
  }

  // =====================================================
  // HAPUS ALIAS
  // =====================================================

  const handleDelete = async (item) => {
  const yakin = await confirm({
    title: 'Buka Kunci Alias',
    message: `Yakin ingin membuka kunci alias "${item.alias}"?\n\nSetelah dibuka, alias ini bisa dipakai OPD manapun.`,
    confirmText: 'Ya, Buka Kunci',
    cancelText: 'Batal',
    type: 'danger',
  })

  if (!yakin) return

    try {
      const token = localStorage.getItem('token')

      const response = await fetch(
        `${API_URL}/api/admin/super/locked-aliases/${item.id}`,
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result.message || 'Gagal membuka kunci alias.'
        )
      }

      setAliases((prev) =>
        prev.filter((a) => a.id !== item.id)
      )

      setSuccess('Kunci alias berhasil dibuka.')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      alert(err.message)
    }
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="la">

      {/* HEADER */}
      <div className="la__header">
        <div>
          <h1 className="la__title">Kelola Alias</h1>
          <p className="la__subtitle">
            Kunci alias tertentu untuk OPD tertentu. User dari OPD lain
            nggak bisa memakai alias yang sudah dikunci.
          </p>
        </div>

        <button
          type="button"
          className="la__btn-primary"
          onClick={() => {
            setShowForm(!showForm)
            setFormError('')
            if (showForm) {
              setUnitKerjaSearch('')
            }
          }}
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          <span>{showForm ? 'Tutup' : 'Kunci Alias Baru'}</span>
        </button>
      </div>

      {/* ALERT */}
      {success && (
        <div className="la__alert la__alert--success">
          <CheckCircle2 size={16} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="la__alert la__alert--error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* FORM */}
      {showForm && (
        <form className="la__form-card" onSubmit={handleSubmit}>
          <div className="la__form-header">
            <div className="la__form-icon">
              <Lock size={20} />
            </div>
            <div>
              <h3 className="la__form-title">Kunci Alias Baru</h3>
              <p className="la__form-subtitle">
                Alias yang dikunci hanya bisa dipakai oleh OPD yang dipilih.
              </p>
            </div>
          </div>

          <div className="la__form-body">
            {formError && (
              <div className="la__error">{formError}</div>
            )}

            <div className="la__field">
              <label>Alias</label>
              <input
                className="la__input"
                type="text"
                placeholder="Contoh: kominfo"
                value={formAlias}
                onChange={(e) => setFormAlias(e.target.value)}
                required
              />
              <small className="la__hint">
                Hanya huruf, angka, tanda hubung (-), dan garis bawah (_).
              </small>
            </div>

            <div className="la__field">
              <label>Dikunci Untuk Unit Kerja</label>

              <div className="la__unit-picker">
                <input
                  className="la__input"
                  type="text"
                  placeholder="🔍 Ketik untuk cari... (mis: kominfo)"
                  value={unitKerjaSearch}
                  onChange={(e) => {
                    setUnitKerjaSearch(e.target.value)
                    setShowUnitKerjaDropdown(true)
                    if (formUnitKerja) setFormUnitKerja('')
                  }}
                  onFocus={() => setShowUnitKerjaDropdown(true)}
                  onBlur={() =>
                    setTimeout(
                      () => setShowUnitKerjaDropdown(false),
                      200
                    )
                  }
                  autoComplete="off"
                  required
                />

                {showUnitKerjaDropdown && (
                  <div className="la__unit-dropdown">
                    {filteredUnitKerjas.length === 0 ? (
                      <div className="la__unit-dropdown__empty">
                        Tidak ada unit kerja yang cocok
                      </div>
                    ) : (
                      filteredUnitKerjas.map((unit) => (
                        <button
                          key={unit.id}
                          type="button"
                          className={`la__unit-dropdown__item ${
                            String(formUnitKerja) === String(unit.id)
                              ? 'la__unit-dropdown__item--active'
                              : ''
                          }`}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setFormUnitKerja(unit.id)
                            setUnitKerjaSearch(unit.nama_unit_kerja)
                            setShowUnitKerjaDropdown(false)
                          }}
                        >
                          {unit.nama_unit_kerja}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="la__form-actions">
              <button
                type="button"
                className="la__btn-secondary"
                onClick={() => {
                  setShowForm(false)
                  setFormError('')
                  setFormAlias('')
                  setFormUnitKerja('')
                  setUnitKerjaSearch('')
                }}
              >
                Batal
              </button>
              <button
                type="submit"
                className="la__btn-primary"
                disabled={formLoading}
              >
                {formLoading ? 'Menyimpan...' : '🔒 Kunci Alias'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* LIST */}
      <div className="la__list-card">
        <div className="la__list-header">
          <div>
            <h3 className="la__list-title">Daftar Alias Terkunci</h3>
            <p className="la__list-subtitle">
              Total {aliases.length} alias terkunci
            </p>
          </div>
        </div>

        {loading ? (
          <div className="la__empty">Memuat data...</div>
        ) : aliases.length === 0 ? (
          <div className="la__empty">
            <Shield size={32} className="la__empty-icon" />
            <strong>Belum ada alias terkunci</strong>
            <p>
              Klik tombol <b>Kunci Alias Baru</b> di atas untuk memulai.
            </p>
          </div>
        ) : (
          <div className="la__list">
            {aliases.map((item) => (
              <div key={item.id} className="la__item">
                <div className="la__item-left">
                  <div className="la__item-icon">
                    <Lock size={16} />
                  </div>

                  <div className="la__item-info">
                    <div className="la__item-top">
                      <strong className="la__item-alias">
                        /{item.alias}
                      </strong>
                    </div>

                    <span className="la__item-unit">
                      🔒 Dikunci untuk:{' '}
                      <b>
                        {item.unit_kerja?.nama_unit_kerja ||
                          'Unit kerja tidak diketahui'}
                      </b>
                    </span>

                    {item.creator && (
                      <span className="la__item-creator">
                        Dibuat oleh: {item.creator.name}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="la__btn-danger"
                  onClick={() => handleDelete(item)}
                  title="Buka kunci"
                >
                  <Trash2 size={14} />
                  <span>Buka Kunci</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default LockedAlias