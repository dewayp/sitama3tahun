# 💕 Anniversary Website – 3 Tahun Bersama

Website anniversary interaktif untuk **1 Maret 2026** (3 tahun bersama).

## 🚀 Cara Deploy ke GitHub Pages

1. Buat repository baru di GitHub (nama bebas, misal: `anniversary`)
2. Upload semua file dan folder ke repository
3. Buka **Settings → Pages**
4. Pilih **Source: Deploy from a branch**
5. Branch: **main**, Folder: **/ (root)**
6. Klik Save
7. Tunggu beberapa menit, website akan aktif di `https://usernamekamu.github.io/anniversary`

---

## 📁 Panduan Lengkap Penamaan File

### 📸 Foto Berdua (untuk animasi floowing, ledakan foto, background)
Letakkan di: `assets/images/couple/`

| Nama File | Isi |
|---|---|
| `photo_01.jpg` | Foto berdua ke-1 |
| `photo_02.jpg` | Foto berdua ke-2 |
| `photo_03.jpg` | Foto berdua ke-3 |
| ... | ... |
| `photo_15.jpg` | Foto berdua ke-15 |

> **Tips:**
> - Format: JPG, JPEG, atau PNG
> - Ukuran ideal: **600×900px** (portrait) atau **800×600px** (landscape)
> - Compress dulu di [squoosh.app](https://squoosh.app) agar load cepat
> - Minimal butuh **5 foto**, idealnya **12-15 foto**

---

### 🗓️ Foto Kenangan Per Tahun (untuk Game 2 dan Momen Spesial)
Letakkan di: `assets/images/memories/`

| Nama File | Isi |
|---|---|
| `mem_2023_01.jpg` | Foto terbaik tahun 2023 |
| `mem_2024_01.jpg` | Foto terbaik tahun 2024 |
| `mem_2025_01.jpg` | Foto terbaik tahun 2025 |

> **Tips:**
> - Cukup **1 foto per tahun**
> - Pilih foto yang paling berkesan dari masing-masing tahun
> - Ukuran ideal: **600×800px** (portrait)

---

### 🎵 Audio (Musik & Efek Suara)
Letakkan di: `assets/audio/`

| Nama File | Fungsi | Keterangan |
|---|---|---|
| `bgm_main.mp3` | Musik latar utama | Lembut, romantis. Durasi >2 menit, loop |
| `bgm_intimate.mp3` | Musik scene MAAF | Lebih pelan, personal |
| `sfx_notif.mp3` | Suara notifikasi Telegram | Suara "ting" |
| `sfx_pop.mp3` | Suara tangkap hati (Game 1) | Suara pop/bubble |
| `sfx_correct.mp3` | Suara benar (Game 2) | Suara positif |
| `sfx_wrong.mp3` | Suara salah (Game 2) | Suara negatif lembut |
| `sfx_rope.mp3` | Suara tarik tali | Suara kain/swipe |

> **Tip audio gratis:** Download dari [pixabay.com/music](https://pixabay.com/music) – bebas copyright!
>
> ⚠️ **Tanpa file audio, website tetap berjalan normal** – hanya tanpa suara.

---

## ⚙️ Konfigurasi

Edit file `js/config.js` untuk mengubah:

```js
whatsappNumber: "62XXXXXXXXXX",  // ← Ganti dengan nomor WA kamu!
```

Format nomor: `62` + nomor tanpa angka `0` di depan.
Contoh: `+62 812-3456-7890` → `"628123456789"`

---

## 🧪 Test Lokal

Karena menggunakan file lokal, buka dengan **Live Server**:

1. Install extension **Live Server** di VS Code
2. Klik kanan `index.html` → **Open with Live Server**
3. Website terbuka di browser

Atau upload langsung ke GitHub Pages dan test dari HP!

---

## 📱 Tampilan Terbaik

Website ini dirancang untuk **mobile portrait** (maksimal 430px lebar).
Di desktop, website akan tercentering otomatis dengan border di kanan-kiri.
