import { useState, useMemo, useRef, useEffect } from 'react'
import { Search, Lock } from 'lucide-react'
import './UnitKerjaPicker.css'

// =====================================================
// KAMUS SINGKATAN OPD / DINAS
// User ketik singkatan → otomatis diterjemahkan ke nama lengkap
// =====================================================
const SINONIM = {
  // Dinas
  disdik: 'pendidikan',
  dindik: 'pendidikan',
  dinkes: 'kesehatan',
  dishub: 'perhubungan',
  dinsos: 'sosial',
  diskominfo: 'komunikasi',
  kominfo: 'komunikasi',
  disperindag: 'perindustrian',
  disnaker: 'tenaga kerja',
  dukcapil: 'kependudukan',
  disbudpar: 'kebudayaan',
  dispora: 'pemuda',
  dispertan: 'pertanian',
  disperikanan: 'perikanan',
  disperkim: 'perumahan',
  diskop: 'koperasi',
  dppkb: 'pengendalian penduduk',
  dpmptsp: 'penanaman modal',
  pupr: 'pekerjaan umum',
  dpu: 'pekerjaan umum',
  dlh: 'lingkungan hidup',
  dispertaru: 'pertanahan',

  // Badan
  bpkad: 'keuangan dan aset',
  bappeda: 'perencanaan pembangunan',
  bppkad: 'pengelolaan keuangan',
  bpbd: 'penanggulangan bencana',
  bpsdm: 'pengembangan sumber daya manusia',
  bkd: 'kepegawaian',
  bkpsdm: 'kepegawaian',
  bakorwil: 'pembangunan',

  // Sekretariat
  setda: 'sekretariat daerah',
  setwan: 'sekretariat dewan',
  dprd: 'dewan perwakilan',

  // Lembaga Lain
  inspektorat: 'inspektorat',
  satpolpp: 'polisi pamong praja',
  kesbangpol: 'kesatuan bangsa',

  // Umum
  kab: 'kabupaten',
  kabupaten: 'kabupaten',
  landak: 'landak',
}

/**
 * Terjemahkan input user berdasarkan kamus sinonim.
 * Contoh: "disdik" → "pendidikan"
 *         "din pendidikan" → "pendidikan" (per kata)
 */
function translateKeyword(input) {
  const lower = input.toLowerCase().trim()
  if (!lower) return ''

  // Cek dulu full match (misal user ketik "disdik" doang)
  if (SINONIM[lower]) return SINONIM[lower]

  // Kalau tidak, cek per kata
  return lower
    .split(/\s+/)
    .map((word) => SINONIM[word] || word)
    .join(' ')
}

function UnitKerjaPicker({
  unitKerjas = [],
  value = '',
  onChange,
  placeholder = 'Ketik untuk cari unit kerja...',
  includePublicOption = true,
  publicLabel = '🌐 Terbuka untuk umum (siapa saja bisa akses)',
}) {
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef(null)

  // Cari nama unit yang sedang dipilih
  const selectedUnit = useMemo(() => {
    return unitKerjas.find((u) => String(u.id) === String(value))
  }, [unitKerjas, value])

  // Update search text saat value berubah dari luar
  useEffect(() => {
    if (selectedUnit) {
      setSearch(selectedUnit.nama_unit_kerja)
    } else if (value === '' || value === null) {
      setSearch('')
    }
  }, [selectedUnit, value])

  // =====================================================
  // FILTER + FUZZY SEARCH + KAMUS SINGKATAN
  // =====================================================
  const filtered = useMemo(() => {
    const sorted = [...unitKerjas].sort((a, b) =>
      a.nama_unit_kerja.localeCompare(b.nama_unit_kerja, 'id', {
        sensitivity: 'base',
      })
    )

    const rawInput = search.trim().toLowerCase()
    if (!rawInput) return sorted

    // Terjemahkan singkatan dulu
    const translated = translateKeyword(rawInput)
    const keyword = translated.replace(/\s+/g, '')

    const exactMatches = []
    const fuzzyMatches = []

    for (const unit of sorted) {
      const compact = unit.nama_unit_kerja.toLowerCase().replace(/\s+/g, '')

      // 1. Prioritas: substring match (paling akurat)
      if (compact.includes(keyword)) {
        exactMatches.push(unit)
        continue
      }

      // 2. Fuzzy: huruf-huruf keyword muncul berurutan
      let i = 0
      for (const char of compact) {
        if (char === keyword[i]) i++
        if (i === keyword.length) break
      }
      if (i === keyword.length) {
        fuzzyMatches.push(unit)
      }
    }

    return [...exactMatches, ...fuzzyMatches]
  }, [unitKerjas, search])

  // Klik di luar → tutup dropdown
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false)
        if (selectedUnit) {
          setSearch(selectedUnit.nama_unit_kerja)
        } else if (value === '' || value === null) {
          setSearch('')
        }
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [selectedUnit, value])

  const handleSelect = (unit) => {
    onChange(String(unit.id))
    setSearch(unit.nama_unit_kerja)
    setIsOpen(false)
  }

  const handleSelectPublic = () => {
    onChange('')
    setSearch('')
    setIsOpen(false)
  }

  const handleClear = () => {
    onChange('')
    setSearch('')
    setIsOpen(true)
  }

  return (
    <div className="ukp" ref={wrapperRef}>
      <div className="ukp__input-wrapper">
        <Search size={14} className="ukp__icon" />
        <input
          type="text"
          className="ukp__input"
          placeholder={placeholder}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          autoComplete="off"
        />
        {search && (
          <button
            type="button"
            className="ukp__clear"
            onClick={handleClear}
            aria-label="Hapus pencarian"
          >
            ×
          </button>
        )}
      </div>

      {isOpen && (
        <div className="ukp__dropdown">
          {includePublicOption && (
            <button
              type="button"
              className={`ukp__item ${
                !value ? 'ukp__item--active' : ''
              } ukp__item--public`}
              onClick={handleSelectPublic}
            >
              {publicLabel}
            </button>
          )}

          {filtered.length === 0 ? (
            <div className="ukp__empty">Tidak ada unit kerja yang cocok</div>
          ) : (
            filtered.map((unit) => (
              <button
                key={unit.id}
                type="button"
                className={`ukp__item ${
                  String(value) === String(unit.id) ? 'ukp__item--active' : ''
                }`}
                onClick={() => handleSelect(unit)}
              >
                <Lock size={12} className="ukp__item-icon" />
                {unit.nama_unit_kerja}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default UnitKerjaPicker