import { useState, useEffect, useMemo } from 'react'
import './Login.css'
import { useToast } from './components/Toast'

function Login({ onLogin }) {
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
  const toast = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [unitKerjaId, setUnitKerjaId] = useState('')
  const [userType, setUserType] = useState('UMUM')
  const [unitKerjas, setUnitKerjas] = useState([])

  const [unitKerjaSearch, setUnitKerjaSearch] = useState('')
  const [showUnitKerjaDropdown, setShowUnitKerjaDropdown] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)


  useEffect(() => {
    const googleToken = new URLSearchParams(
      window.location.search
    ).get('google_token')

    if (!googleToken) return

    const handleGoogleLogin = async () => {
      try {
        setLoading(true)
        setError('')

        localStorage.setItem('token', googleToken)

        const response = await fetch(
          `${API_URL}/api/user`,
          {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${googleToken}`,
            },
          }
        )

        const result = await response.json()

        if (!response.ok) {
          throw new Error(
            result.message || 'Login Google gagal.'
          )
        }

        onLogin(result)

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        )

      } catch (error) {
        console.error('GOOGLE LOGIN ERROR:', error)

        localStorage.removeItem('token')

        setError(
          error.message || 'Login Google gagal.'
        )
      } finally {
        setLoading(false)
      }
    }

    handleGoogleLogin()
  }, []) // <--- PERBAIKAN: Ubah dari [onLogin] menjadi []

  useEffect(() => {
    if (!isRegister) return

    const fetchUnitKerjas = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/unit-kerjas`
        )

        const result = await response.json()

        if (!response.ok) {
          throw new Error(
            result.message || 'Gagal mengambil data unit kerja.'
          )
        }

        setUnitKerjas(result.data || [])
      } catch (error) {
        console.error('UNIT KERJA ERROR:', error)
        setError('Gagal mengambil daftar unit kerja.')
      }
    }

    fetchUnitKerjas()
  }, [isRegister])

  const handleLogin = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await fetch(
        `${API_URL}/api/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result.message || 'Email atau password salah.'
        )
      }

      localStorage.setItem('token', result.token)

      onLogin(result.user)

    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    setError('')

    if (!name.trim()) {
      setError('Nama lengkap wajib diisi.')
      return
    }

    if (!email.trim()) {
      setError('Email wajib diisi.')
      return
    }

    if (userType === 'ASN' && !unitKerjaId) {
      setError('Unit kerja wajib dipilih untuk ASN.')
      return
    }
    if (!userType) {
      setError('Jenis user wajib dipilih.')
      return
    }

    if (!password) {
      setError('Password wajib diisi.')
      return
    }

    if (password.length < 8) {
      setError('Password minimal 8 karakter.')
      return
    }

    if (!confirmPassword) {
      setError('Konfirmasi password wajib diisi.')
      return
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak sama.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        `${API_URL}/api/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password: password,
            password_confirmation: confirmPassword,
            unit_kerja_id: userType === 'ASN' ? unitKerjaId : null,
            user_type: userType,
          }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        if (result.errors) {
          if (result.errors.email) {
            throw new Error(
              'Email tersebut sudah terdaftar. Silakan gunakan email lain.'
            )
          }

          const firstError = Object.values(result.errors)[0][0]
          throw new Error(firstError)
        }

        throw new Error(
          result.message || 'Registrasi gagal.'
        )
      }

      setIsRegister(false)

      setName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setUnitKerjaId('')
      setUnitKerjaSearch('')
      setUserType('UMUM')

      toast.success('Registrasi berhasil. Silakan login.')

    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // =====================================================
  // SORT & FILTER UNIT KERJA (Abjad + Fuzzy Search)
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

  return (
    <div className="login-page">
      <div className="login-card">

        {/* BAGIAN KIRI - BRANDING */}
        <div className="login-brand">
          <div className="login-brand-content">
           <div className="login-logos">
  <img
    src="/Lambang_Kabupaten_Landak.png"
    alt="Lambang Kabupaten Landak"
    className="login-logo"
  />
  <div className="login-logo-circle">
    <img
      src="/logo-kominfo-landak.png"
      alt="Logo Diskominfo Landak"
      className="login-logo"
    />
  </div>
</div>

            <h1 className="login-brand-title">PENINK</h1>

            <p className="login-brand-subtitle">
              Platform Short Link &amp; Link Hub
            </p>

            <div className="login-brand-divider" />

            <p className="login-brand-location">
              Dinas Komunikasi dan Informatika<br />
              Kabupaten Landak
            </p>
          </div>

          <div className="login-brand-decoration" aria-hidden="true" />
        </div>


        {/* BAGIAN KANAN - FORM */}
        <div className="login-form-area">

          <div className="login-heading">
            <h2>{isRegister ? 'Buat Akun' : 'Selamat Datang'}</h2>
            <p>
              {isRegister
              ? 'Daftarkan akun baru. Pilih jenis user dulu, lalu lengkapi data.'
              : 'Silakan masuk ke akun PENINK Anda'}
            </p>
          </div>

          <form onSubmit={isRegister ? handleRegister : handleLogin}>

            {isRegister && (
              <div className="login-field">
                <label htmlFor="name">Nama Lengkap</label>
                <input
                  id="name"
                  className="input"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            {/* JENIS USER */}
            {isRegister && (
              <div className="login-field">
                <label htmlFor="user-type">Jenis User</label>
                <select
                  id="user-type"
                  className="input"
                  value={userType}
                  onChange={(e) => {
                    const newType = e.target.value
                    setUserType(newType)

                    if (newType === 'UMUM') {
                      setUnitKerjaId('')
                      setUnitKerjaSearch('')
                    }
                  }}
                >
                  <option value="UMUM">UMUM</option>
                  <option value="ASN">ASN</option>
                </select>
              </div>
            )}

            {/* UNIT KERJA — hanya untuk ASN */}
            {isRegister && userType === 'ASN' && (
              <div className="login-field">
                <label htmlFor="unit-kerja">Unit Kerja</label>

                <div className="unit-kerja-picker">
                  <input
                    id="unit-kerja"
                    type="text"
                    className="input"
                    placeholder="🔍 Ketik untuk cari... (mis: kominfo)"
                    value={unitKerjaSearch}
                    onChange={(e) => {
                      setUnitKerjaSearch(e.target.value)
                      setShowUnitKerjaDropdown(true)
                      if (unitKerjaId) setUnitKerjaId('')
                    }}
                    onFocus={() => setShowUnitKerjaDropdown(true)}
                    onBlur={() =>
                      setTimeout(
                        () => setShowUnitKerjaDropdown(false),
                        200
                      )
                    }
                    autoComplete="off"
                  />

                  {showUnitKerjaDropdown && (
                    <div className="unit-kerja-dropdown">
                      {filteredUnitKerjas.length === 0 ? (
                        <div className="unit-kerja-dropdown__empty">
                          Tidak ada unit kerja yang cocok
                        </div>
                      ) : (
                        filteredUnitKerjas.map((unit) => (
                          <button
                            key={unit.id}
                            type="button"
                            className={`unit-kerja-dropdown__item ${
                              unitKerjaId === unit.id
                                ? 'unit-kerja-dropdown__item--active'
                                : ''
                            }`}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              setUnitKerjaId(unit.id)
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
            )}

            <div className="login-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                className="input"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  className="input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {isRegister && (
              <div className="login-field">
                <label htmlFor="confirm-password">Konfirmasi Password</label>
                <div className="password-input-wrapper">
                  <input
                    id="confirm-password"
                    className="input"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Ulangi password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="login-error" role="alert">
                <span className="login-error-icon">⚠</span>
                <span>{error}</span>
              </div>
            )}

            <button
              className="button login-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? 'Memproses...'
                : isRegister
                ? 'Daftar'
                : 'Masuk'}
            </button>

            {/* TOMBOL GOOGLE — AKTIF */}
            {!isRegister && (
              <>
                <div className="login-divider">
                  <span>atau</span>
                </div>

                <button
                  type="button"
                  className="google-login-button"
                  onClick={() => {
                    window.location.href =
                    `${API_URL}/api/auth/google`
                  }}
                  disabled={loading}
                >
                  <span className="google-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path fill="#4285F4" d="M21.35 12.2c0-.7-.06-1.37-.18-2H12v3.79h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.18z"/>
                      <path fill="#34A853" d="M12 21.7c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.29v2.53A9.74 9.74 0 0 0 12 21.7z"/>
                      <path fill="#FBBC05" d="M6.54 13.78A5.85 5.85 0 0 1 6.23 12c0-.62.11-1.22.31-1.78V7.69H3.29A9.74 9.74 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.31l3.25-2.53z"/>
                      <path fill="#EA4335" d="M12 6.19c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.28 14.63 2.3 12 2.3a9.74 9.74 0 0 0-8.71 5.39l3.25 2.53C7.31 7.91 9.46 6.19 12 6.19z"/>
                    </svg>
                  </span>
                  <span>Masuk dengan Google</span>
                </button>
              </>
            )}
          </form>

          <div className="login-switch">
            {isRegister ? (
              <>
                Sudah punya akun?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(false)
                    setError('')
                  }}
                >
                  Masuk
                </button>
              </>
            ) : (
              <>
                Belum punya akun?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(true)
                    setError('')
                  }}
                >
                  Daftar
                </button>
              </>
            )}
          </div>

          <div className="login-footer">
            PENINK — Kabupaten Landak
          </div>

        </div>
      </div>
    </div>
  )
}

export default Login