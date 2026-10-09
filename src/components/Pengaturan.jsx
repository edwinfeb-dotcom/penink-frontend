import { useState, useEffect } from 'react'
import {
  Palette,
  Database,
  Info,
  Check,
  Trash2,
  Save,
  Pencil,
  X,
} from 'lucide-react'
import './Pengaturan.css'
import { useConfirm } from './ConfirmModal'
import { useToast } from './Toast'

// Konstanta zoom untuk tiap ukuran font
const ZOOM_LEVELS = {
  small: '0.9',
  medium: '1',
  large: '1.15',
}

function Pengaturan({ user, API_URL }) {
  const confirm = useConfirm()
  const toast = useToast()

  // ============ STATE PREFERENSI ============
  const [prefs, setPrefs] = useState({
    fontSize: 'medium',
    compactMode: false,
  })
  const [saved, setSaved] = useState(false)

  // ============ STATE SETTINGS (dari database) ============
  const [settings, setSettings] = useState({
    app_version: { value: '1.0.0', label: 'Versi Aplikasi' },
    app_name: { value: 'PENINK', label: 'Nama Aplikasi' },
    app_developer: {
      value: 'Dinas Komunikasi dan Informatika Kabupaten Landak',
      label: 'Pengembang',
    },
  })
  const [settingsLoading, setSettingsLoading] = useState(true)

  // State untuk edit versi
  const [editingKey, setEditingKey] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [savingSetting, setSavingSetting] = useState(false)

  // Cek apakah user adalah super admin
  const isSuperAdmin =
    String(user?.role || '').toLowerCase() === 'super_admin'

  // ============ LOAD PREFERENSI DARI LOCALSTORAGE ============
  useEffect(() => {
    const stored = localStorage.getItem('penink_preferences')
    if (stored) {
      try {
        setPrefs((prev) => ({ ...prev, ...JSON.parse(stored) }))
      } catch (e) {
        console.error('Gagal load preferensi:', e)
      }
    }
  }, [])

  // ============ APPLY PREFS ============
  useEffect(() => {
    const root = document.documentElement
    root.style.zoom = ZOOM_LEVELS[prefs.fontSize] || '1'
    if (prefs.compactMode) {
      root.setAttribute('data-compact', 'true')
    } else {
      root.removeAttribute('data-compact')
    }
  }, [prefs])

  // ============ FETCH SETTINGS DARI API ============
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`${API_URL}/api/settings`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error('Gagal ambil settings')

        const data = await res.json()
        if (data.data) {
          setSettings((prev) => ({ ...prev, ...data.data }))
        }
      } catch (err) {
        console.error('SETTINGS FETCH ERROR:', err)
      } finally {
        setSettingsLoading(false)
      }
    }

    fetchSettings()
  }, [API_URL])

  // ============ SIMPAN PREFERENSI ============
  const handleSave = () => {
    localStorage.setItem('penink_preferences', JSON.stringify(prefs))
    setSaved(true)
    toast.success('Pengaturan berhasil disimpan.')
    setTimeout(() => setSaved(false), 2500)
  }

  const updatePref = (key, value) => {
    setPrefs((prev) => {
      const updated = { ...prev, [key]: value }
      localStorage.setItem('penink_preferences', JSON.stringify(updated))
      return updated
    })
  }

  // ============ CLEAR CACHE ============
  const handleClearCache = async () => {
    const yakin = await confirm({
      title: 'Bersihkan Cache',
      message:
        'Yakin ingin membersihkan cache?\n\nPreferensi akan direset ke default.',
      confirmText: 'Ya, Bersihkan',
      cancelText: 'Batal',
      type: 'warning',
    })

    if (!yakin) return

    localStorage.removeItem('penink_preferences')
    document.documentElement.style.zoom = '1'
    document.documentElement.removeAttribute('data-compact')

    setPrefs({ fontSize: 'medium', compactMode: false })
    toast.success('Cache berhasil dibersihkan.')
  }

  // ============ MULAI EDIT SETTING ============
  const startEditSetting = (key) => {
    setEditingKey(key)
    setEditValue(settings[key]?.value || '')
  }

  const cancelEditSetting = () => {
    setEditingKey(null)
    setEditValue('')
  }

  // ============ SIMPAN SETTING (hanya super admin) ============
  const handleSaveSetting = async (key) => {
    if (!editValue.trim()) {
      toast.error('Versi tidak boleh kosong.')
      return
    }

    if (!isSuperAdmin) {
      toast.error('Hanya Super Admin yang bisa mengubah versi.')
      return
    }

    try {
      setSavingSetting(true)

      const token = localStorage.getItem('token')

      const res = await fetch(`${API_URL}/api/admin/super/settings/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ value: editValue.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Gagal menyimpan.')
      }

      // Update state lokal
      setSettings((prev) => ({
        ...prev,
        [key]: { ...prev[key], value: editValue.trim() },
      }))

      setEditingKey(null)
      setEditValue('')

      toast.success(data.message || 'Berhasil diperbarui.')
    } catch (err) {
      console.error('SAVE SETTING ERROR:', err)
      toast.error(err.message || 'Gagal menyimpan.')
    } finally {
      setSavingSetting(false)
    }
  }

  return (
    <div className="pengaturan">
      {/* ============ HEADER ============ */}
      <div className="pengaturan__header">
        <div>
          <h1 className="pengaturan__title">Pengaturan</h1>
          <p className="pengaturan__subtitle">
            Preferensi aplikasi PENINK Anda
          </p>
        </div>

        <button
          type="button"
          className={`pengaturan__save ${saved ? 'pengaturan__save--done' : ''}`}
          onClick={handleSave}
        >
          {saved ? (
            <>
              <Check size={16} />
              Tersimpan
            </>
          ) : (
            <>
              <Save size={16} />
              Simpan
            </>
          )}
        </button>
      </div>

      {/* ============ SECTION 1: TAMPILAN ============ */}
      <section className="pengaturan__section">
        <div className="pengaturan__section-head">
          <div className="pengaturan__section-icon pengaturan__section-icon--purple">
            <Palette size={18} />
          </div>
          <div>
            <h2 className="pengaturan__section-title">Tampilan</h2>
            <p className="pengaturan__section-desc">
              Sesuaikan tampilan aplikasi
            </p>
          </div>
        </div>

        <div className="pengaturan__grid">
          <div className="pengaturan__field">
            <label htmlFor="fontSize">Ukuran Font</label>
            <select
              id="fontSize"
              value={prefs.fontSize}
              onChange={(e) => updatePref('fontSize', e.target.value)}
            >
              <option value="small">Kecil</option>
              <option value="medium">Sedang</option>
              <option value="large">Besar</option>
            </select>
          </div>

          <div className="pengaturan__field pengaturan__field--toggle">
            <div>
              <span className="pengaturan__toggle-label">Mode Ringkas</span>
              <span className="pengaturan__toggle-desc">
                Tampilkan lebih banyak konten dalam satu layar
              </span>
            </div>
            <label className="pengaturan__switch">
              <input
                type="checkbox"
                checked={prefs.compactMode}
                onChange={(e) =>
                  updatePref('compactMode', e.target.checked)
                }
              />
              <span className="pengaturan__switch-slider" />
            </label>
          </div>
        </div>
      </section>

      {/* ============ SECTION 2: DATA & PRIVASI ============ */}
      <section className="pengaturan__section">
        <div className="pengaturan__section-head">
          <div className="pengaturan__section-icon pengaturan__section-icon--green">
            <Database size={18} />
          </div>
          <div>
            <h2 className="pengaturan__section-title">Data & Privasi</h2>
            <p className="pengaturan__section-desc">
              Kelola data aplikasi Anda
            </p>
          </div>
        </div>

        <div className="pengaturan__actions">
          <button
            type="button"
            className="pengaturan__btn pengaturan__btn--danger"
            onClick={handleClearCache}
          >
            <Trash2 size={16} />
            Bersihkan Cache
          </button>
        </div>
      </section>

      {/* ============ SECTION 3: TENTANG ============ */}
      <section className="pengaturan__section">
        <div className="pengaturan__section-head">
          <div className="pengaturan__section-icon pengaturan__section-icon--gray">
            <Info size={18} />
          </div>
          <div>
            <h2 className="pengaturan__section-title">Tentang Aplikasi</h2>
            <p className="pengaturan__section-desc">
              Informasi aplikasi PENINK
            </p>
          </div>
        </div>

        <div className="pengaturan__about">
          {/* Nama Aplikasi */}
          <div className="pengaturan__about-row">
            <span className="pengaturan__about-label">Nama Aplikasi</span>
            <span className="pengaturan__about-value">
              {settingsLoading
                ? '...'
                : settings.app_name?.value || 'PENINK'}
            </span>
          </div>

          {/* Versi — bisa diedit super admin */}
          <div className="pengaturan__about-row">
            <span className="pengaturan__about-label">Versi</span>

            {editingKey === 'app_version' ? (
              <div className="pengaturan__edit-inline">
                <input
                  type="text"
                  className="pengaturan__edit-input"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder="Contoh: 1.0.1"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveSetting('app_version')
                    if (e.key === 'Escape') cancelEditSetting()
                  }}
                />
                <button
                  type="button"
                  className="pengaturan__edit-save"
                  onClick={() => handleSaveSetting('app_version')}
                  disabled={savingSetting}
                  title="Simpan"
                >
                  <Check size={14} />
                </button>
                <button
                  type="button"
                  className="pengaturan__edit-cancel"
                  onClick={cancelEditSetting}
                  disabled={savingSetting}
                  title="Batal"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="pengaturan__about-value-group">
                <span className="pengaturan__about-value">
                  {settingsLoading
                    ? '...'
                    : settings.app_version?.value || '1.0.0'}
                </span>
                {isSuperAdmin && (
                  <button
                    type="button"
                    className="pengaturan__edit-btn"
                    onClick={() => startEditSetting('app_version')}
                    title="Edit versi (Super Admin)"
                  >
                    <Pencil size={12} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pengembang */}
          <div className="pengaturan__about-row">
            <span className="pengaturan__about-label">Pengembang</span>
            <span className="pengaturan__about-value">
              {settingsLoading
                ? '...'
                : settings.app_developer?.value ||
                  'Dinas Komunikasi dan Informatika Kabupaten Landak'}
            </span>
          </div>

          {/* Login sebagai */}
          <div className="pengaturan__about-row">
            <span className="pengaturan__about-label">Login sebagai</span>
            <span className="pengaturan__about-value">
              {user?.email || '-'}
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Pengaturan