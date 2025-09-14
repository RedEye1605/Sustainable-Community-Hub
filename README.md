<p align="center"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></p>

# Sustainable Community Hub

Sustainable Community Hub adalah platform web berbasis Laravel dan React (Inertia.js) untuk kolaborasi komunitas dalam mengelola proyek sosial, donasi, dan aktivitas relawan secara terstruktur dan transparan.

## Fitur Utama

- **Manajemen Proyek Sosial:** Buat, edit, hapus, dan dokumentasikan proyek dengan deskripsi, gambar, status, tanggal mulai, serta jumlah peserta yang dibutuhkan.
- **Dashboard Multi-Role:** Tampilan dashboard berbeda untuk admin, pengelola proyek, donatur, dan relawan.
- **Manajemen Relawan:** Pengguna dapat bergabung atau keluar dari proyek sebagai relawan.
- **Sistem Donasi:** Mendukung donasi dan permintaan bantuan secara langsung melalui platform.
- **Manajemen Peran & Izin:** Menggunakan Spatie Laravel Permission untuk kontrol akses berbasis role (admin, pengelola proyek, relawan, donatur).
- **Autentikasi & Registrasi:** Sistem login, registrasi, dan manajemen profil pengguna.
- **Upload Gambar Proyek:** Dokumentasi visual untuk setiap proyek.
- **Pengujian Otomatis:** Unit test untuk memastikan keamanan dan stabilitas fitur.

## Instalasi

1. **Clone repository**
   ```bash
   git clone https://github.com/username/sustainable-community-hub.git
   cd sustainable-community-hub
   ```

2. **Install dependency backend**
   ```bash
   composer install
   ```

3. **Install dependency frontend**
   ```bash
   npm install
   ```

4. **Copy file environment**
   ```bash
   cp .env.example .env
   ```

5. **Generate key**
   ```bash
   php artisan key:generate
   ```

6. **Migrasi dan seed database**
   ```bash
   php artisan migrate --seed
   ```

7. **Jalankan server**
   ```bash
   php artisan serve
   npm run dev
   ```

## Struktur Folder Penting

- `resources/js/Pages/` — Halaman React (Inertia.js) untuk dashboard, proyek, donasi, profil, dll.
- `resources/js/Components/` — Komponen UI seperti tombol, modal, carousel, dsb.
- `app/Http/Controllers/` — Controller Laravel untuk logika backend.
- `database/seeders/` — Seeder untuk data awal (admin, role, dsb).

## Kontribusi

Kontribusi sangat terbuka! Silakan fork repo ini dan buat pull request untuk fitur atau perbaikan bug.

## Lisensi

Proyek ini menggunakan lisensi MIT.

---

Sustainable Community Hub membantu komunitas dan organisasi sosial mengelola kegiatan secara efektif, efisien, dan transparan dalam satu sistem terintegrasi.
