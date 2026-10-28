import { useState, useEffect, useMemo } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./Login.css";
import { useToast } from "./components/Toast";

function Login({ onLogin }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const toast = useToast();

  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✨ Menghitung berapa kali user gagal login
  const [loginAttempts, setLoginAttempts] = useState(0);

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State untuk Lupa Password (Minta Link)
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  // ✨ STATE BARU: Untuk Form Buat Password Baru (dari link email)
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [unitKerjaId, setUnitKerjaId] = useState("");
  const [userType, setUserType] = useState("UMUM");
  const [unitKerjas, setUnitKerjas] = useState([]);

  const [unitKerjaSearch, setUnitKerjaSearch] = useState("");
  const [showUnitKerjaDropdown, setShowUnitKerjaDropdown] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✨ CEK URL: Apakah ini halaman reset password dari email?
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const email = params.get("email");

    if (token && email && window.location.pathname === "/reset-password") {
      setIsResetPassword(true);
      setResetToken(token);
      setResetEmail(email);
    }
  }, []);

  useEffect(() => {
    if (!isRegister) return;

    const fetchUnitKerjas = async () => {
      try {
        const response = await fetch(`${API_URL}/api/unit-kerjas`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Gagal mengambil data unit kerja.");
        }

        setUnitKerjas(result.data || []);
      } catch (error) {
        console.error("UNIT KERJA ERROR:", error);
        setError("Gagal mengambil daftar unit kerja.");
      }
    };

    fetchUnitKerjas();
  }, [isRegister, API_URL]);

  // =====================================================
  // LOGIN
  // =====================================================
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          login: loginValue,
          password: password,
        }),
      });

      const result = await response.json();

      if (response.status === 429) {
        throw new Error(
          result.message ||
            "Terlalu banyak percobaan login. Coba lagi dalam 1 menit.",
        );
      }

      if (!response.ok) {
        setLoginAttempts((prev) => prev + 1);
        throw new Error(result.message || "Email atau password salah.");
      }

      localStorage.setItem("token", result.token);
      onLogin(result.user);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // REGISTER
  // =====================================================
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Nama lengkap wajib diisi.");
    if (!loginValue.trim()) return setError("Email wajib diisi.");
    if (userType === "ASN" && !unitKerjaId)
      return setError("Unit kerja wajib dipilih untuk ASN.");
    if (!password) return setError("Password wajib diisi.");
    if (password.length < 8) return setError("Password minimal 8 karakter.");

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSymbol) {
      return setError(
        "Password harus mengandung huruf besar, huruf kecil, angka, dan simbol (contoh: Password123!).",
      );
    }

    if (!confirmPassword) return setError("Konfirmasi password wajib diisi.");
    if (password !== confirmPassword)
      return setError("Konfirmasi password tidak sama.");

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: loginValue.trim(),
          password: password,
          password_confirmation: confirmPassword,
          unit_kerja_id: userType === "ASN" ? unitKerjaId : null,
          user_type: userType,
        }),
      });

      const result = await response.json();

      if (response.status === 429) {
        throw new Error(
          result.message ||
            "Terlalu banyak percobaan registrasi. Coba lagi nanti.",
        );
      }

      if (!response.ok) {
        if (result.errors) {
          if (result.errors.email)
            throw new Error(
              "Email tersebut sudah terdaftar. Silakan gunakan email lain.",
            );
          const firstError = Object.values(result.errors)[0][0];
          throw new Error(firstError);
        }
        throw new Error(result.message || "Registrasi gagal.");
      }

      setIsRegister(false);
      setName("");
      setLoginValue("");
      setPassword("");
      setConfirmPassword("");
      setUnitKerjaId("");
      setUnitKerjaSearch("");
      setUserType("UMUM");

      toast.success("Registrasi berhasil. Silakan login.");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FORGOT PASSWORD (MINTA LINK)
  // =====================================================
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setResetSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: resetEmail }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal mengirim link reset password.",
        );
      }

      setResetSuccess(
        "Link reset password telah dikirim ke email Anda. Silakan periksa kotak masuk.",
      );
      setResetEmail("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RESET PASSWORD (SIMPAN PASSWORD BARU DARI EMAIL)
  // =====================================================
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (newPassword !== confirmNewPassword) {
      setError("Konfirmasi password baru tidak sama.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          token: resetToken,
          email: resetEmail,
          password: newPassword,
          password_confirmation: confirmNewPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal mereset password. Token tidak valid.",
        );
      }

      toast.success(
        "Password berhasil diubah. Silakan login dengan password baru.",
      );
      setIsResetPassword(false);
      window.history.replaceState({}, "", "/login");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SORT & FILTER UNIT KERJA
  // =====================================================
  const filteredUnitKerjas = useMemo(() => {
    const sorted = [...unitKerjas].sort((a, b) =>
      a.nama_unit_kerja.localeCompare(b.nama_unit_kerja, "id", {
        sensitivity: "base",
      }),
    );

    const search = unitKerjaSearch.trim().toLowerCase().replace(/\s+/g, "");
    if (!search) return sorted;

    const exactMatches = [];
    const fuzzyMatches = [];

    for (const unit of sorted) {
      const compact = unit.nama_unit_kerja.toLowerCase().replace(/\s+/g, "");
      if (compact.includes(search)) {
        exactMatches.push(unit);
        continue;
      }
      let i = 0;
      for (const char of compact) {
        if (char === search[i]) i++;
        if (i === search.length) break;
      }
      if (i === search.length) {
        fuzzyMatches.push(unit);
      }
    }
    return [...exactMatches, ...fuzzyMatches];
  }, [unitKerjas, unitKerjaSearch]);

  const passRules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };

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
            <div className="login-penink-wrapper">
              <img
                src="/logo-penink-pemendek-link.png"
                alt="PENINK"
                className="login-penink-logo"
              />
            </div>
            <div className="login-brand-divider" />
            <p className="login-brand-location">Kabupaten Landak</p>
          </div>
          <div className="login-brand-decoration" aria-hidden="true" />
        </div>

        {/* BAGIAN KANAN - FORM */}
        <div className="login-form-area">
          {/* ================= 1. FORM BUAT PASSWORD BARU (DARI EMAIL) ================= */}
          {isResetPassword ? (
            <>
              <div className="login-heading">
                <h2>Buat Password Baru</h2>
                <p>Silakan masukkan password baru untuk akun Anda.</p>
              </div>

              <form onSubmit={handleResetPassword}>
                <div className="login-field">
                  <label htmlFor="new-password">
                    Password Baru <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      id="new-password"
                      className="input"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Masukkan password baru"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="login-field">
                  <label htmlFor="confirm-new-password">
                    Konfirmasi Password Baru{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    id="confirm-new-password"
                    className="input"
                    type="password"
                    placeholder="Ulangi password baru"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                  />
                </div>

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
                  {loading ? "Menyimpan..." : "Simpan Password Baru"}
                </button>
              </form>
            </>
          ) : isForgotPassword ? (
            // ================= 2. FORM MINTA LINK RESET =================
            <>
              <div className="login-heading">
                <h2>Lupa Password?</h2>
                <p>
                  Masukkan email Anda. Kami akan mengirimkan tautan untuk
                  mengatur ulang password.
                </p>
              </div>

              <form onSubmit={handleForgotPassword}>
                <div className="login-field">
                  <label htmlFor="reset-email">
                    Email <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    id="reset-email"
                    className="input"
                    type="email"
                    placeholder="nama@email.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <div className="login-error" role="alert">
                    <span className="login-error-icon">⚠</span>
                    <span>{error}</span>
                  </div>
                )}

                {resetSuccess && (
                  <div
                    className="login-error"
                    style={{
                      backgroundColor: "#dcfce7",
                      borderColor: "#86efac",
                      color: "#166534",
                    }}
                    role="alert"
                  >
                    <span className="login-error-icon">✅</span>
                    <span>{resetSuccess}</span>
                  </div>
                )}

                <button
                  className="button login-submit"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Mengirim..." : "Kirim Link Reset"}
                </button>

                <div className="login-switch" style={{ marginTop: "20px" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setError("");
                      setResetSuccess("");
                    }}
                  >
                    ← Kembali ke Login
                  </button>
                </div>
              </form>
            </>
          ) : (
            // ================= 3. FORM LOGIN / DAFTAR =================
            <>
              <div className="login-heading">
                <h2>{isRegister ? "Buat Akun" : "Selamat Datang"}</h2>
                <p>
                  {isRegister
                    ? "Daftarkan akun baru. Pilih jenis user dulu, lalu lengkapi data."
                    : "Silakan masuk ke akun PENINK Anda"}
                </p>
              </div>

              <form onSubmit={isRegister ? handleRegister : handleLogin}>
                {isRegister && (
                  <div className="login-field">
                    <label htmlFor="name">
                      Nama Lengkap <span style={{ color: "red" }}>*</span>
                    </label>
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

                {isRegister && (
                  <div className="login-field">
                    <label htmlFor="user-type">Jenis User</label>
                    <select
                      id="user-type"
                      className="input"
                      value={userType}
                      onChange={(e) => {
                        const newType = e.target.value;
                        setUserType(newType);
                        if (newType === "UMUM") {
                          setUnitKerjaId("");
                          setUnitKerjaSearch("");
                        }
                      }}
                    >
                      <option value="UMUM">UMUM</option>
                      <option value="ASN">
                        ASN Pemerintah Kabupaten Landak
                      </option>
                    </select>
                  </div>
                )}

                {isRegister && userType === "ASN" && (
                  <div className="login-field">
                    <label htmlFor="unit-kerja">
                      Unit Kerja <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="unit-kerja-picker">
                      <input
                        id="unit-kerja"
                        type="text"
                        className="input"
                        placeholder="🔍 Ketik untuk cari... (mis: kominfo)"
                        value={unitKerjaSearch}
                        onChange={(e) => {
                          setUnitKerjaSearch(e.target.value);
                          setShowUnitKerjaDropdown(true);
                          if (unitKerjaId) setUnitKerjaId("");
                        }}
                        onFocus={() => setShowUnitKerjaDropdown(true)}
                        onBlur={() =>
                          setTimeout(() => setShowUnitKerjaDropdown(false), 200)
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
                                className={`unit-kerja-dropdown__item ${unitKerjaId === unit.id ? "unit-kerja-dropdown__item--active" : ""}`}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                  setUnitKerjaId(unit.id);
                                  setUnitKerjaSearch(unit.nama_unit_kerja);
                                  setShowUnitKerjaDropdown(false);
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
                  <label htmlFor="login">
                    Email <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    id="login"
                    className="input"
                    type="email"
                    placeholder="nama@email.com"
                    value={loginValue}
                    onChange={(e) => setLoginValue(e.target.value)}
                    autoComplete="email"
                  />
                </div>

                <div className="login-field">
                  <label htmlFor="password">
                    Password <span style={{ color: "red" }}>*</span>
                  </label>

                  <div className="password-input-wrapper">
                    <input
                      id="password"
                      className="input"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete={
                        isRegister ? "new-password" : "current-password"
                      }
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {isRegister && (
                    <div
                      style={{
                        marginTop: "10px",
                        fontSize: "12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}
                    >
                      <span
                        style={{
                          color: passRules.length ? "#16a34a" : "#94a3b8",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        {passRules.length ? "✓" : "○"} Minimal 8 karakter
                      </span>
                      <span
                        style={{
                          color: passRules.upper ? "#16a34a" : "#94a3b8",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        {passRules.upper ? "✓" : "○"} Mengandung huruf besar
                        (A-Z)
                      </span>
                      <span
                        style={{
                          color: passRules.lower ? "#16a34a" : "#94a3b8",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        {passRules.lower ? "✓" : "○"} Mengandung huruf kecil
                        (a-z)
                      </span>
                      <span
                        style={{
                          color: passRules.number ? "#16a34a" : "#94a3b8",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        {passRules.number ? "✓" : "○"} Mengandung angka (0-9)
                      </span>
                      <span
                        style={{
                          color: passRules.symbol ? "#16a34a" : "#94a3b8",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        {passRules.symbol ? "✓" : "○"} Mengandung simbol
                        (!@#$%^&*)
                      </span>
                    </div>
                  )}
                </div>

                {isRegister && (
                  <div className="login-field">
                    <label htmlFor="confirm-password">
                      Konfirmasi Password{" "}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="password-input-wrapper">
                      <input
                        id="confirm-password"
                        className="input"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Ulangi password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
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
                  {loading ? "Memproses..." : isRegister ? "Daftar" : "Masuk"}
                </button>
              </form>

              <div className="login-switch">
                {isRegister ? (
                  <>
                    {" "}
                    Sudah punya akun?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegister(false);
                        setError("");
                        setLoginAttempts(0);
                      }}
                    >
                      Masuk
                    </button>{" "}
                  </>
                ) : (
                  <>
                    Belum punya akun?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegister(true);
                        setError("");
                        setLoginAttempts(0);
                      }}
                    >
                      Daftar
                    </button>
                    {loginAttempts > 0 && (
                      <div style={{ marginTop: "16px" }}>
                        <button
                          type="button"
                          onClick={() => {
                            setIsForgotPassword(true);
                            setError("");
                            setLoginAttempts(0);
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#ef4444",
                            fontSize: "13px",
                            fontWeight: "600",
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                        >
                          Lupa Password?
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
