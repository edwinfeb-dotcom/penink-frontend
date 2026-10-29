# PENINK - Aplikasi Pemendek Link & Link Hub

Aplikasi PENINK (Pemendek Link & Link Hub) — Diskominfo Kabupaten Landak.

Repository ini berisi dua bagian utama yang dipisahkan menjadi dua folder:

- **`shortlink-client/`** : Frontend (React + Vite)
- **`shortlink-api/`** : Backend (Laravel API)

---

## 🛠️ Tech Stack Frontend

- **Framework:** React 19
- **Build Tool:** Vite
- **Routing:** SPA dengan History API (Custom)
- **HTTP Client:** Fetch API
- **Icons:** Lucide React
- **QR Code:** qrcode.react

## 📋 Requirement

- Node.js 18+
- npm atau yarn
- PHP 8.1+ & Composer (untuk Backend)

## 🚀 Cara Install & Menjalankan (Development)

### 1. Clone Repository

    git clone https://github.com/Diskominfo-Landak/shortlink.git
    cd shortlink

### 2. Setup Backend (Laravel)

    cd shortlink-api
    composer install
    cp .env.example .env
    php artisan key:generate
    # (Sesuaikan konfigurasi database di file .env)
    php artisan migrate --seed
    php artisan serve

Backend akan berjalan di `http://127.0.0.1:8000`.

### 3. Setup Frontend (React)

Buka terminal baru, lalu jalankan:

    cd shortlink-client
    npm install
    cp .env.example .env
    # (Pastikan VITE_API_URL mengarah ke http://127.0.0.1:8000)
    npm run dev

Frontend akan berjalan di `http://localhost:5173`.

## 🏗️ Build untuk Production

    cd shortlink-client
    npm run build

Hasil build ada di folder `dist/`. Folder ini yang di-deploy ke server (bersama backend).

## 🗂️ Struktur Repository (GitHub)

Berikut adalah struktur folder yang ada di dalam repository ini:

    shortlink/ (Root Repository)
    │
    ├── shortlink-client/           # FOLDER FRONTEND (React)
    │   ├── public/
    │   ├── src/
    │   │   ├── components/
    │   │   ├── App.jsx
    │   │   ├── Login.jsx
    │   │   ├── main.jsx
    │   │   └── ...
    │   ├── .env.example
    │   ├── index.html
    │   ├── package.json
    │   └── vite.config.js
    │
    ├── shortlink-api/              # FOLDER BACKEND (Laravel)
    │   ├── app/
    │   │   ├── Http/
    │   │   ├── Models/
    │   │   └── ...
    │   ├── config/
    │   ├── database/
    │   │   ├── migrations/
    │   │   └── seeders/
    │   ├── routes/
    │   ├── .env.example
    │   ├── artisan
    │   └── composer.json
    │
    ├── .gitignore                  # Mengabaikan file .env, node_modules, vendor
    └── README.md                   # Dokumentasi utama (file ini)

## 🎯 Fitur Utama

Aplikasi PENINK telah dilengkapi dengan berbagai fitur untuk mendukung pengelolaan tautan dan keamanan data:

**🔗 Manajemen Tautan (Short Link & Link Hub)**

- **Short Link:** Pembuatan link pendek dengan custom alias. Mendukung Case-Sensitive (membedakan huruf besar/kecil) dan bisa diedit.
- **Link Hub:** Halaman kumpulan link dengan kustomisasi logo instansi (mendukung drag & drop), deskripsi, dan alias otomatis.
- **Statistik Klik & QR:** Setiap link dan Link Hub memiliki statistik jumlah klik dan berapa kali di-scan (QR Code).
- **Locked Alias:** Fitur khusus untuk mengunci alias tertentu agar hanya bisa digunakan oleh OPD/Unit Kerja tertentu.
- **Moderasi Konten:** Sistem otomatis memblokir tautan yang mengandung unsur judi online (judol) atau pinjaman ilegal (pinjol).

**🛡️ Keamanan & Autentikasi**

- **Multi-Role Access:** Hanya ada 2 role utama: Super Admin (akses penuh) dan User (akses terbatas).
- **Aturan Password Ketat:** Wajib kombinasi huruf besar, huruf kecil, angka, dan simbol.
- **Reset Password:** Fitur Lupa Password dengan pengiriman tautan (link) reset melalui Email.
- **Keamanan API:** Menggunakan Laravel Sanctum (Token) dengan masa aktif yang dapat diatur, serta perlindungan Brute-force (Rate Limiting).
- **Audit Database:** Data Super Admin dan Pengaturan Aplikasi (App Settings) dibuat secara otomatis via Database Seeder demi keamanan saat deployment.

**🎨 Tampilan & UX (User Experience)**

- **Desain Responsif:** Tampilan UI/UX dioptimalkan untuk tampilan desktop maupun mobile.
- **Tema Warna Daerah:** Integrasi palet warna yang selaras dengan Lambang Kabupaten Landak (Navy, Emas, Hijau, Merah).
- **Halaman Interaktif:** Dilengkapi dengan halaman Loading Redirect yang animatif dan halaman 404 Not Found yang estetik.
- **Notifikasi Real-time:** Menggunakan Toast dan Modal untuk notifikasi yang lebih user-friendly.

## 🔐 Role Akses

Aplikasi PENINK menerapkan pembatasan hak akses berdasarkan Role untuk menjaga keamanan data. Saat ini, hanya terdapat dua role utama yang aktif:

| Role            | Hak Akses & Fitur                                                                                                                                                                                                                                                                                                                                                                    |
| :-------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **super_admin** | **Akses Penuh (Global)**<br>• Melihat dan mengelola seluruh data (User, Short Link, Link Hub, Statistik).<br>• Menambah, mengedit, dan menghapus akun User.<br>• Mengelola Alias Terkunci (Locked Alias) untuk OPD.<br>• Mengakses dan mengubah halaman Pengaturan Aplikasi.                                                                                                         |
| **user**        | **Akses Terbatas (Personal/OPD)**<br>• Membuat, mengedit, dan menghapus Short Link & Link Hub milik sendiri.<br>• Melihat statistik klik & QR milik sendiri.<br>• Khusus User ASN: Dapat melihat Short Link milik ASN lain di unit kerja yang sama, namun hanya diizinkan untuk Copy Link dan melihat QR Code (tidak bisa mengedit atau menghapus).<br>• Memberikan Saran & Masukan. |

_Catatan: Role admin dan admin_unit telah dihapus dari sistem sesuai instruksi revisi terbaru dari Project Manager._
