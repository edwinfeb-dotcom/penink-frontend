import { useState, useEffect, useRef } from "react";
import "./VerifyOtp.css";

export default function VerifyOtp({ email, onLogin, onBackToLogin }) {
    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isResending, setIsResending] = useState(false); // <-- STATE BARU
    const [timer, setTimer] = useState(60);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(
                () => setTimer((prev) => prev - 1),
                1000,
            );
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData
            .getData("text")
            .slice(0, 6)
            .split("");
        if (pastedData.every((char) => !isNaN(char))) {
            const newOtp = [...otp];
            pastedData.forEach((char, i) => {
                if (i < 6) newOtp[i] = char;
            });
            setOtp(newOtp);
            inputRefs.current[5].focus();
        }
    };

    // ✨ FUNGSI BARU: UNTUK KIRIM ULANG OTP ✨
    const handleResend = async () => {
        setIsResending(true);
        setError("");

        try {
            const response = await fetch(`${API_URL}/api/resend-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(
                    "Kode OTP baru telah dikirim ke email Anda. Silakan cek kotak masuk.",
                );
                setTimer(60); // Reset timer jadi 60 detik lagi
                setOtp(["", "", "", "", "", ""]); // Kosongkan inputan sebelumnya
                inputRefs.current[0].focus(); // Fokus ke kotak pertama
            } else {
                setError(data.message || "Gagal mengirim ulang kode OTP.");
            }
        } catch (err) {
            setError("Terjadi kesalahan jaringan. Silakan coba lagi.");
        } finally {
            setIsResending(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpCode = otp.join("");

        if (otpCode.length !== 6) {
            setError("Silakan masukkan 6 digit kode OTP.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_URL}/api/verify-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ email, otp_code: otpCode }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                onLogin(data.user);
                window.history.pushState({}, "", "/dashboard");
            } else {
                setError(data.message || "Kode OTP salah atau kadaluarsa.");
                setOtp(["", "", "", "", "", ""]);
                inputRefs.current[0].focus();
            }
        } catch (err) {
            setError("Terjadi kesalahan jaringan. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="otp-container">
            <div className="otp-card">
                <div className="otp-header">
                    <h2>Verifikasi Email</h2>
                    <p>
                        Kami telah mengirimkan 6 digit kode ke <br />
                        <strong>{email}</strong>
                    </p>
                </div>

                {error && <div className="otp-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="otp-inputs">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) =>
                                    handleChange(index, e.target.value)
                                }
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                ref={(el) => (inputRefs.current[index] = el)}
                                className={digit ? "filled" : ""}
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="otp-btn"
                        disabled={loading}
                    >
                        {loading ? "Memverifikasi..." : "Verifikasi Kode"}
                    </button>
                </form>

                <div className="otp-resend">
                    <button
                        type="button"
                        onClick={onBackToLogin}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#666",
                            textDecoration: "underline",
                            cursor: "pointer",
                            marginBottom: "15px",
                        }}
                    >
                        ← Kembali ke Login
                    </button>
                    <br />
                    <span>Tidak menerima kode? </span>
                    {timer > 0 ? (
                        <span className="otp-timer">
                            Kirim ulang dalam {timer}s
                        </span>
                    ) : (
                        <button
                            className="otp-resend-btn"
                            onClick={handleResend}
                            disabled={isResending} // <-- TOMBOL DIUPDATE
                            style={{
                                opacity: isResending ? 0.5 : 1,
                                cursor: isResending ? "not-allowed" : "pointer",
                            }}
                        >
                            {isResending ? "Mengirim..." : "Kirim Ulang"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
