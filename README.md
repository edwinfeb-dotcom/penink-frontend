# PENINK Frontend

Frontend aplikasi **PENINK** (Platform Short Link & Link Hub) — Diskominfo Kabupaten Landak.

## 🛠️ Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** SPA dengan History API
- **HTTP Client:** Fetch API
- **Icons:** Lucide React
- **QR Code:** qrcode.react

## 📋 Requirement

- Node.js 18+
- npm atau yarn

## 🚀 Cara Install (Development)

### 1. Clone Repository

```bash
git clone https://github.com/edwinfeb-dotcom/penink-frontend.git
cd penink-frontend
```

### 2. Install Dependensi

```bash
npm install
```

### 3. Setup Environment

Bikin file `.env` di root folder:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Ganti `VITE_API_URL` sesuai URL backend.

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka `http://localhost:5173` di browser.

## 🏗️ Build untuk Production

```bash
npm run build
```

Hasil build ada di folder `dist/`. Folder ini yang di-deploy ke server (bersama backend).

## 🗂️ Struktur Folder

```
src/
├── components/
│   ├── Dashboard.jsx
│   ├── ShortLink.jsx
│   ├── LinkHub.jsx
│   ├── Statistik.jsx
│   ├── Users.jsx
│   ├── Feedback.jsx
│   ├── Sidebar.jsx
│   ├── Header.jsx
│   ├── LockedAlias.jsx
│   ├── Pengaturan.jsx
│   └── ...
├── App.jsx
├── main.jsx
├── Login.jsx
├── Login.css
├── App.css
└── ...

public/
├── logo-penink.png
├── logo-kominfo-landak.png
├── Lambang_Kabupaten_Landak.png
└── ...
```

## 🎯 Fitur Utama

- **Short Link** — Buat & kelola link pendek dengan custom alias
- **Link Hub** — Kumpulan link dalam satu halaman (dengan logo custom per OPD)
- **Statistik** — Dashboard klik & QR scan
- **Moderasi Konten** — Blokir otomatis judol/pinjol
- **Multi-user** — Role-based access
- **Locked Alias** — Alias terkunci untuk OPD tertentu
- **Google Login** — OAuth via Google

## 🔐 Role Akses

| Role | Akses |
|------|-------|
| `super_admin` | Semua fitur + kelola alias terkunci |
| `admin` | Kelola semua user & konten |
| `admin_unit` | Kelola user & konten OPD sendiri |
| `user` | Short link & link hub sendiri |

## 📝 Lisensi

© 2026 Diskominfo Kabupaten Landak. All rights reserved.