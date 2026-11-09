# PENJELASAN KODE KAMECOS — baris per baris

Dokumen ini menjelaskan SETIAP baris kode di project Kamecos, satu per satu.
Ditujukan untuk developer pemula. Baca pelan-pelan, jangan dihafal — pahami polanya.

---

## 0. Panduan membaca + kamus istilah

Sebelum masuk ke kode, hafalkan istilah yang muncul berulang. Ini fondasi —
begitu paham, seluruh file jadi jauh lebih mudah dibaca.

### Istilah JavaScript/TypeScript

- `import { X } from "tempat"` → ambil fungsi/komponen/variabel bernama `X`
  dari file atau library lain, supaya bisa dipakai di file ini.
- `export function Nama()` → buat fungsi bernama `Nama` DAN kirim keluar,
  supaya file lain bisa `import` dia.
- `export const nama = ...` → sama, tapi untuk nilai (bukan fungsi).
- `function` → kotak kode yang bisa dipanggil. Isinya langkah-langkah.
- `return (...)` → hasil yang dikirim fungsi ke pemakainya. Di komponen,
  hasilnya JSX (tampilan) yang dipasang ke layar.
- `const x = ...` → bikin kotak penyimpan yang isinya TIDAK BOLEH diganti.
- `let x = ...` → kotak penyimpan yang isinya boleh diganti.
- `=>` (arrow function) → cara singkat menulis fungsi.
  `(item) => item.name` artinya "fungsi yang menerima `item`, lalu
  mengembalikan `item.name`".
- `a && b` → kalau `a` benar, baru kerjakan/tampilkan `b`. Kalau `a`
  salah, hasilnya langsung `false` (b tidak dikerjakan).
- `kondisi ? A : B` (ternary) → if singkat: kalau kondisi benar pakai `A`,
  kalau salah pakai `B`.
- `x ?? y` → pakai `x` kalau ada nilainya; kalau `x` itu `null`/`undefined`,
  pakai `y`.
- `x?.properti` → akses `properti` kalau `x` ada; kalau `x` null, hasil `null`
  (mencegah error "cannot read property of null").
- `array.map(fn)` → ubah tiap isi array jadi nilai baru; hasilnya array baru.
- `array.filter(fn)` → buang isi array yang tidak lolos syarat `fn`.
- `array.sort(fn)` → urutkan ulang array sesuai aturan `fn`.
- `array[key]` → ambil isi pada posisi `key` (mulai dari 0).
- `%` (modulo) → sisa bagi. `5 % 3` = `2`. Dipakai untuk perulangan daftar
  (misal bergilir warna).
- `...` (spread) → buka isi array/object. `[...arr]` = salinan `arr`.

### Istilah React / Next.js

- **Komponen** → fungsi yang mengembalikan JSX (tampilan). Nama diawali huruf
  besar (`Hero`, `Packages`).
- **JSX** → tampilan mirip HTML yang ditulis di dalam file `.tsx`.
- **Server Component** → komponen tanpa `"use client"` di baris pertama.
  Dijalankan di SERVER. Boleh baca database & pegang kunci rahasia.
- **Client Component** → komponen dengan `"use client"` di baris pertama.
  Dijalankan di browser. Boleh pakai state, event klik, dll. TIDAK boleh
  pegang kunci rahasia.
- **props** → data yang dikirim ke komponen lewat atribut, misal
  `<ComponentClass data={nilai} />`.
- `{children}` → isi yang diapit di antara tag pembuka & penutup komponen.
- `className` → atribut class HTML. Di React ditulis `className` (bukan
  `class`) karena `class` adalah kata khusus JavaScript.
- `{...}` di dalam JSX → buka mode JavaScript. Apa pun di dalamnya ditulis
  sebagai kode, bukan teks. Contoh: `{nama}` menampilkan isi variabel `nama`.

### Class Tailwind yang sering muncul (ringkas)

- `py-16` / `px-4` → padding atas-bawah (`py`) / kiri-kanan (`px`). Angka
  makin besar = ruang makin lebar.
- `max-w-6xl` → batasi lebar konten maksimum, supaya tidak melebar penuh di
  layar besar. `mx-auto` = tengahkan.
- `text-3xl` → ukuran huruf; `font-bold` = tebal; `text-center` = rata tengah.
- `grid` + `grid-cols-3` → susun anaknya jadi kolom (3 kolom).
  `sm:grid-cols-4` = di layar lebar (≥640px) jadi 4 kolom; `sm:` = prefix
  "mulai dari layar kecil ke atas".
- `gap-4` → jarak antar kolom/baris.
- `bg-gradient-to-br` → latar gradasi ke arah bawah-kanan.
  `from-X` / `to-Y` = warna awal & akhir gradasi.
- `flex` + `items-center` + `justify-center` → susun sejajar & tengahkan.
- `text-muted-foreground` → warna teks redup (kode warna dari tema).

---

## 1. Peta folder

```
kamecos/
├── app/                    → RUTING (halaman + kerangka)
│   ├── layout.tsx          → kerangka semua halaman (html + body)
│   ├── page.tsx            → halaman utama "/"
│   └── globals.css         → CSS global + tema (tidak dibedah di sini)
├── components/             → KOMPONEN (bagian-bagian tampilan)
│   ├── site-header.tsx     → bar atas (logo + menu + tombol)
│   ├── site-footer.tsx     → bar bawah
│   ├── home/               → section halaman utama
│   │   ├── hero.tsx
│   │   ├── featured-cosplayers.tsx
│   │   ├── featured-kamekos.tsx
│   │   ├── gallery.tsx
│   │   ├── how-it-works.tsx
│   │   └── packages.tsx
│   └── ui/                 → komponen dasar shadcn (badge, button, card…)
├── lib/                    → LOGIKA & BANTUAN
│   ├── seed.ts             → data contoh (sementara)
│   ├── utils.ts            → helper cn()
│   └── supabase/           → koneksi database
│       ├── client.ts       → client untuk BROWSER
│       └── server.ts       → client untuk SERVER
├── supabase/migrations/    → skema database (lihat Modul-Belajar-Supabase.md)
├── package.json            → daftar dependency + perintah npm
└── next.config.ts          → pengaturan Next.js
```

**Cara baca penjelasan di bawah:** tiap baris ditulis sebagai
`**N.** kode` lalu tanda `→` dan artinya.

---

## 2. `app/layout.tsx` — kerangka semua halaman

**Untuk apa:** setiap halaman Next.js dibungkus layout ini. Isinya tag
`<html>` dan `<body>` yang wajib ada sekali per halaman web.

**1.** `import type { Metadata } from "next";`
→ Ambil `Metadata` hanya sebagai TIPE (bukan kode jalan). Dipakai untuk
menandai variabel di baris 23.

**2.** `import { Geist, Geist_Mono } from "next/font/google";`
→ Ambil 2 font (Geist untuk teks, Geist_Mono untuk kode) dari Google Font,
lewat fitur next/font. Font didownload saat build, jadi tidak bergantung
ke server Google saat halaman dibuka.

**3.** `import "./globals.css";`
→ Impor style global (warna tema, reset CSS). Tanpa ini halaman polos.

**4.** `import { SiteHeader } from "@/components/site-header";`
→ Ambil komponen bar atas. `@/` adalah alias untuk folder project.

**5.** `import { SiteFooter } from "@/components/site-footer";`
→ Ambil komponen bar bawah.

**7–11.** komentar `/* ... */`
→ Catatan untuk manusia. JavaScript abaikan isinya. Menjelaskan bahwa layout
adalah kerangka bersama, dan `children` adalah isi halaman.

**13.** `const geistSans = Geist({`
→ Panggil fungsi `Geist` untuk memuat font, simpan hasilnya di `geistSans`.

**14.** `variable: "--font-geist-sans",`
→ Daftarkan font ke variabel CSS bernama `--font-geist-sans`, supaya bisa
dipakai lewat class Tailwind.

**15.** `subsets: ["latin"],`
→ Muat hanya huruf latin (hemat ukuran). Tidak perlu huruf lain.

**16.** `});`
→ Tutup panggilan `Geist`.

**18–21.** `const geistMono = Geist_Mono({ ... });`
→ Sama persis seperti di atas, untuk font kedua (monospace, untuk teks kode).

**23.** `export const metadata: Metadata = {`
→ Ekspor object bernama `metadata`. Next.js otomatis memakai ini untuk
judul tab browser + deskripsi mesin pencari (SEO).

**24.** `title: "Kamecos — Marketplace Cosplayer & Fotografer Cosplay",`
→ Judul halaman yang tampil di tab browser.

**25–26.** `description:`
→ Deskripsi singkat, dipakai Google saat menampilkan hasil pencarian.

**27.** `};`
→ Tutup object `metadata`.

**29.** `export default function RootLayout({ children }: LayoutProps<"/">) {`
→ Komponen layout UTAMA. Ia menerima `children` (isi halaman). `default`
artinya ini komponen utama file ini. TypeScript memakai `LayoutProps` untuk
mengetahui tipe `children`.

**30.** `return (`
→ Mulai mengembalikan tampilan (JSX).

**31.** `<html`
→ Tag pembuka `<html>` — pembungkus terluar dokumen web.

**32.** `lang="id"`
→ Bahasa konten = Indonesia (membantu screen reader & SEO).

**33.** `` className={`${geistSans.variable} ${geistMono.variable} antialiased`} ``
→ Pasang class CSS: dua variabel font + `antialiased` (huruf halus).
`${...}` menyisipkan nilai variabel ke dalam string.

**34.** `>`
→ Tutup tag pembuka `<html>`.

**35.** `<body className="min-h-dvh flex flex-col font-sans">`
→ Tag `<body>`. Class: tinggi minimum 1 layar (`min-h-dvh`), susun anak
ke bawah (`flex flex-col`), font default (`font-sans`).

**36.** `<SiteHeader />`
→ Pasang bar atas. Di JSX, komponen ditulis seperti tag.

**37.** `<main className="flex-1">{children}</main>`
→ Area isi halaman. `flex-1` = ambil semua sisa ruang (supaya footer selalu
mentok ke bawah). `{children}` = isi halaman yang sedang dibuka.

**38.** `<SiteFooter />`
→ Pasang bar bawah.

**39.** `</body>`
→ Tutup body.

**40.** `</html>`
→ Tutup html.

**41.** `);`
→ Tutup `return`.

**42.** `}`
→ Tutup fungsi `RootLayout`.

---

## 3. `app/page.tsx` — halaman utama "/"

**Untuk apa:** merangkai section-section halaman utama sesuai urutan yang
diinginkan. Di Next.js, `app/page.tsx` otomatis menjadi alamat `/` (root).

**1.** `import { Suspense } from "react";`
→ Ambil `Suspense` dari React. `Suspense` = pembungkus "bagian yang lambat",
menampilkan pengganti sementara selagi bagian itu menunggu data.

**3–8.** `import { Hero } from "@/components/home/hero";` dst.
→ Ambil 6 komponen section homepage. Satu baris = satu section.

**10–18.** komentar `/* ... */`
→ Menjelaskan: file ini SERVER COMPONENT (tanpa "use client"), dan
urutan section di layar.

**19.** `export default function Home() {`
→ Komponen halaman utama, bernama `Home`. `default` menandai ini komponen
yang diekspor utama dari file.

**20.** `return (`
→ Mulai tampilan.

**21.** `<>`
→ "Fragment": pembungkus tanpa elemen nyata. Dipakai karena JSX boleh
mengembalikan hanya SATU elemen; fragment = satu wadah tak terlihat.

**22–26.** `<Hero />` … `<HowItWorks />`
→ Pasang 5 section berturut-turut. Urutan di sini = urutan di layar.

**27–31.** komentar `{/* ... */}`
→ Komentar DI DALAM JSX (pakai `{/* */}`, bukan `/* */` biasa). Menjelaskan
kenapa `Packages` dibungkus Suspense.

**32.** `<Suspense`
→ Buka pembungkus Suspense.

**33.** `fallback={`
→ Properti `fallback` = apa yang ditampilkan SELAMA isi Suspense belum siap.

**34.** `<section className="py-16 text-center text-sm text-muted-foreground">`
→ Tampilan sementara: ruang + teks tengah kecil berwarna redup.

**35.** `Memuat paket&hellip;`
→ Teks yang muncul selagi paket dimuat. `&hellip;` = karakter "…".

**36.** `</section>`
→ Tutup tampilan sementara.

**37.** `}`
→ Tutup `fallback`.

**38.** `>`
→ Tutup tag pembuka `<Suspense>`.

**39.** `<Packages />`
→ Section paket — komponen yang membaca DATABASE, makanya butuh dibungkus
Suspense (halaman tetap cepat tampil, paket menyusul).

**40.** `</Suspense>`
→ Tutup Suspense.

**41.** `</>`
→ Tutup fragment.

**42.** `);`
→ Tutup return.

**43.** `}`
→ Tutup fungsi.

**Kenapa `Suspense` diperlukan di sini:** `Packages` baca Supabase (lewat
internet = lambat). Tanpa Suspense, SELURUH halaman ikut menunggu. Dengan
Suspense, section lain tampil duluan, paket menyusul. Ini juga yang membuat
route `/` di build menjadi "Partial Prerender" (sebagian statis, sebagian
dialirkan dinamis).

---

## 4. `components/site-header.tsx` — bar atas

**Untuk apa:** logo + menu navigasi + tombol Masuk/Daftar, menempel di atas.

**1.** `import { Button } from "@/components/ui/button";`
→ Ambil tombol siap pakai (gaya sudah diatur).

**2.** `import { Camera, Menu } from "lucide-react";`
→ Ambil 2 ikon (kamera, menu/hamburger) dari library ikon lucide-react.

**4.** `export function SiteHeader() {`
→ Komponen bar atas.

**5.** `return (`
→ Mulai tampilan.

**6.** `<header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">`
→ Tag `<header>` pembungkus. Class artinya: menempel di atas saat scroll
(`sticky top-0`), di atas lapisan lain (`z-40`), lebar penuh, garus bawah,
latar semi-transparan + efek kabur (`backdrop-blur`).

**7.** `<div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4">`
→ Wadah dalam: tinggi 64px (`h-16`), lebar dibatasi `max-w-6xl`, ditengahkan
`mx-auto`, isi tersebar ke kiri-kanan (`justify-between`).

**8.** komentar `{/* Logo: ikon + nama brand */}`
→ Catatan dalam JSX.

**9.** `<a href="#" className="flex items-center gap-2 font-semibold">`
→ Link logo. `href="#"` = belum menuju ke mana (placeholder).

**10.** `<span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">`
→ Kotak kecil berisi ikon: 32px, membulat, latar warna utama, konten
ditengahkan. Ini "lencana" ikon logo.

**11.** `<Camera className="size-4" />`
→ Ikon kamera 16px, di dalam kotak.

**12.** `</span>`
→ Tutup kotak ikon.

**13.** `Kamecos`
→ Teks nama brand, di samping ikon.

**14.** `</a>`
→ Tutup link logo.

**16.** komentar
**17.** `<nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 text-sm md:flex">`
→ Menu navigasi. `absolute left-1/2 -translate-x-1/2` = diposisikan
di tengah. `hidden md:flex` = sembunyi di layar kecil, tampil di layar
sedang ke atas (menu desktop).

**18–20.** `<a href="#cosplayer" ...>Cosplayer</a>`
→ Link ke section ber-id `cosplayer` (scroll ke bagian itu). `hover:text-foreground transition-colors` = berubah warna halus saat disentuh kursor.

**21–23.** sama, untuk `#kameko` → "Fotografer"
**24–26.** sama, untuk `#galeri` → "Galeri"
**27–29.** sama, untuk `#paket` → "Paket"

**30.** `</nav>` → tutup menu.

**32.** `<div className="flex items-center gap-2">`
→ Wadah tombol kanan (Masuk / Daftar / ikon menu).

**33.** `<Button variant="ghost" size="sm" className="hidden sm:inline-flex">`
→ Tombol "Masuk" gaya `ghost` (transparan), ukuran kecil, tampil hanya di
layar `sm` ke atas.

**34.** `Masuk` → label tombol.

**35.** `</Button>`

**36.** `<Button size="sm">Daftar Gratis</Button>`
→ Tombol "Daftar Gratis" (gaya default/isi warna).

**37.** `<Button variant="ghost" size="icon" className="md:hidden">`
→ Tombol ikon menu (untuk mobile). `md:hidden` = tampil HANYA di layar kecil.

**38.** `<Menu className="size-4" />`
→ Ikon 3 garis (hamburger).

**39.** `</Button>`

**40.** `</div>` → tutup wadah tombol.
**41.** `</div>` → tutup wadah dalam.
**42.** `</header>` → tutup header.
**43.** `);` → tutup return.
**44.** `}` → tutup fungsi.

---

## 5. `components/site-footer.tsx` — bar bawah

**Untuk apa:** info kecil di bawah halaman. Murni tampilan, tanpa logika.

**1.** komentar `/* Konsep: footer = info bawah halaman. Murni presentasi. */`
**2.** `export function SiteFooter() {` → komponen footer.
**3.** `return (` → mulai tampilan.
**4.** `<footer className="border-t py-10">` → tag `<footer>`, garis atas +
ruang vertikal.
**5.** `<div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row">`
→ Wadah: ditengahkan, susun vertikal di layar kecil (`flex-col`) lalu
horizontal di layar lebar (`sm:flex-row`), teks kecil redup.
**6.** `<p>© 2026 Kamecos. Semua hak dilindungi.</p>` → teks hak cipta.
**7.** `<p>Tampilan memakai data contoh (seed).</p>` → catatan bahwa data
masih dummy (nanti hilang saat database penuh).
**8.** `</div>` **9.** `</footer>` **10.** `);` **11.** `}`

---

## 6. `components/home/hero.tsx` — section atas (hero)

**Untuk apa:** sambutan besar di paling atas halaman: label, judul, deskripsi,
2 tombol ajakan.

**1.** `import { Badge } from "@/components/ui/badge";`
→ Ambil komponen lencana/badge.

**2.** `import { Button } from "@/components/ui/button";`
→ Ambil tombol.

**3.** `import { Sparkles } from "lucide-react";`
→ Ambil ikon kilau.

**5.** `export function Hero() {`
→ Komponen hero.

**6.** `return (` → mulai tampilan.

**7.** `<section className="relative overflow-hidden">`
→ Tag `<section>`. `relative` = dasar untuk posisi anak `absolute`;
`overflow-hidden` = potong apa pun yang keluar batas.

**8.** baris kosong.

**9.** `<div className="absolute inset-0 -z-10 bg-gradient-to-b from-fuchsia-100/70 to-transparent dark:from-fuchsia-950/30" />`
→ Lapisan latar belakang: posisi memenuhi section (`inset-0`), di BELAKANG
konten (`-z-10`), gradasi ungu muda menuju transparan (versi gelap beda).
Div yang "menutup sendiri" (`/>`) = elemen kosong tanpa isi.

**10.** baris kosong.

**11.** `<div className="mx-auto max-w-6xl px-4 py-20 text-center sm:py-28">`
→ Wadah konten hero: ditengahkan, dibatasi lebarnya, ruang atas-bawah,
teks rata tengah.

**12.** `<Badge variant="secondary" className="mb-4">`
→ Lencana gaya secondary, dengan jarak bawah `mb-4`.

**13.** `<Sparkles className="size-3" />`
→ Ikon kilau kecil.

**14.** `Khusus fotografi cosplay`
→ Teks lencana.

**15.** `</Badge>`

**16.** baris kosong.

**17.** `<h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">`
→ Judul utama (heading level 1, penting untuk SEO + aksesibilitas): besar,
tebal, lebar dibatasi `max-w-3xl`, makin besar di layar lebar (`sm:text-5xl`).

**18.** `Temukan fotografer yang paham konsep karaktermu`
→ Teks judul.

**19.** `</h1>`

**20.** baris kosong.

**21.** `<p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">`
→ Paragraf deskripsi: teks agak besar, warna redup, jarak atas.

**22–24.** teks deskripsi (dibelah beberapa baris agar rapi; browser
tetap membacanya satu paragraf).
**25.** `</p>`

**26.** baris kosong.

**27.** `<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">`
→ Wadah dua tombol: tersusun VERTIKAL di layar kecil (`flex-col`), jadi
HORIZONTAL di layar lebar (`sm:flex-row`), dengan jarak antar tombol.

**28.** `<Button size="lg" asChild>`
→ Tombol besar. `asChild` = jangan render `<button>` sendiri, tapi
"tumpangi" anaknya (di sini link) supaya link yang memakai gaya tombol.

**29.** `<a href="#kameko">Jelajahi Fotografer</a>`
→ Link menuju section fotografer, bergaya tombol.

**30.** `</Button>`

**31.** `<Button size="lg" variant="outline" asChild>`
→ Tombol kedua: besar, gaya outline (hanya garis tepi).

**32.** `<a href="#paket">Lihat Paket &amp; Harga</a>`
→ Link ke section paket. `&amp;` = karakter "&" yang aman di HTML/JSX.

**33.** `</Button>`

**34.** `</div>` → tutup wadah tombol.
**35.** `</div>` → tutup wadah konten.
**36.** `</section>` → tutup section.
**37.** `);` → tutup return.
**38.** `}` → tutup fungsi.

---

## 7. `components/home/featured-cosplayers.tsx` — section cosplayer

**Untuk apa:** menampilkan grid daftar cosplayer (data masih dari seed).

**1–2.** `import { Badge } ...` dan `import { Card, CardContent } ...`
→ Ambil lencana + kartu.

**3.** `import { featuredCosplayers } from "@/lib/seed";`
→ Ambil data contoh cosplayer dari `lib/seed.ts`.

**5–14.** `const coverGradients = [ ... ];`
→ Array berisi 8 pasang class gradasi warna. Dipakai untuk memberi "foto
placeholder" berwarna bergantian (karena belum ada foto asli).

**16.** `export function FeaturedCosplayers() {`
→ Komponen section cosplayer.

**17.** `return (` → mulai tampilan.

**18.** `<section id="cosplayer" className="py-16 sm:py-20">`
→ Section dengan `id="cosplayer"` — INI yang jadi tujuan link `#cosplayer`
di header. Jarak atas-bawah.

**19.** `<div className="mx-auto max-w-6xl px-4">` → wadah konten.

**20.** `<div className="mb-8 text-center">` → wadah judul (tengah).

**21.** `<h2 className="text-3xl font-bold tracking-tight">Featured Cosplayer</h2>`
→ Judul section (heading level 2, di bawah h1).

**22–24.** `<p ...>Cosplayer aktif dengan galeri hasil foto terbaru mereka.</p>`
→ Subjudul deskripsi.

**25.** `</div>`

**26.** baris kosong.

**27.** `<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">`
→ Grid kartu: 2 kolom di layar kecil, 4 kolom di layar lebar.

**28.** `{featuredCosplayers.map((c, i) => (`
→ LOOPING: untuk tiap item `c` (dan index `i`) di array `featuredCosplayers`,
render satu kartu. `map` = ubah tiap item jadi kartu.

**29.** `<Card key={c.id} className="overflow-hidden py-0">`
→ Kartu. `key={c.id}` = penanda unik WAJIB saat looping di React (supaya
React tahu kartu mana yang mana).

**30.** `<div`
→ Buka div "cover" (foto placeholder warna).

**31.** `` className={`flex h-32 items-center justify-center bg-gradient-to-br text-4xl font-bold text-white sm:h-36 ${coverGradients[i % coverGradients.length]}`} ``
→ Class: tinggi 128px (144px di layar lebar), isi ditengahkan, latar
gradasi, teks putih besar tebal. Bagian `${coverGradients[i % coverGradients.length]}`
ambil warna bergilir: index item dibagi 8, sisanya = posisi warna — jadi
warna berputar tanpa kehabisan daftar.

**32.** `>`

**33.** `{c.name[0]}`
→ Tampilkan huruf PERTAMA nama cosplayer (sebagai avatar sementara).

**34.** `</div>` → tutup cover.

**35.** `<CardContent className="space-y-1.5 p-4">`
→ Area isi kartu, jarak antar baris kecil, padding.

**36.** `<p className="font-semibold leading-none">{c.name}</p>`
→ Nama cosplayer (tebal).

**37–39.** `<p className="text-sm text-muted-foreground">{c.handle} · {c.city}</p>`
→ Baris handle + kota (kecil, redup). `·` = titik pemisah.

**40.** `<Badge variant="secondary">{c.genre}</Badge>`
→ Lencana genre (misal "Dark Fantasy").

**41.** `</CardContent>`

**42.** `</Card>`

**43.** `))}`
→ Tutup `map` + tutup ekspresi JSX `{...}`.

**44.** `</div>` → tutup grid.
**45.** `</div>` → tutup wadah.
**46.** `</section>` → tutup section.
**47.** `);` → tutup return.
**48.** `}` → tutup fungsi.

---

## 8. `components/home/featured-kamekos.tsx` — section fotografer

**Untuk apa:** grid fotografer (kameko) dengan urutan: iklan dulu, lalu
rating tertinggi.

**1.** `import { Star, BadgeCheck } from "lucide-react";`
→ Ambil ikon bintang & centang-verifikasi.

**3.** `import { Avatar, AvatarFallback } from "@/components/ui/avatar";`
→ Ambil komponen avatar (foto bulat) + fallback-nya.

**4–5.** `import { Badge } ...` dan `import { Card, CardContent } ...`
→ Lencana + kartu.

**6.** `import { featuredKamekos, formatRupiah, initials } from "@/lib/seed";`
→ Ambil data kameko + 2 helper dari seed.

**8.** baris kosong.

**9.** `export function FeaturedKamekos() {`
→ Komponen section kameko.

**10.** komentar `// urutkan: iklan dulu, lalu rating tertinggi`

**11.** `const sorted = [...featuredKamekos].sort((a, b) => {`
→ `[...featuredKamekos]` = SALINAN array (spread), lalu `.sort(...)` urutkan.
Menyalin supaya array asli di seed tidak berubah.

**12.** `if (a.isAd !== b.isAd) return a.isAd ? -1 : 1;`
→ Aturan urut 1: kalau status iklan berbeda, yang `isAd = true` duluan
(nilai negatif = maju). `return -1` artinya `a` di depan `b`.

**13.** `return b.rating - a.rating;`
→ Aturan urut 2: kalau keduanya sama-sama iklan/bukan, urutkan dari rating
TERBESAR ke terkecil (`b.rating - a.rating` positif = `b` duluan = besar dulu).

**14.** `});` → tutup sort.

**15.** baris kosong.

**16.** `return (` → mulai tampilan.

**17.** `<section id="kameko" className="bg-muted/40 py-16 sm:py-20">`
→ Section ber-id `kameko` (tujuan link `#kameko`). Latar agak abu
(`bg-muted/40`) agar berbeda dari section lain.

**18.** `<div className="mx-auto max-w-6xl px-4">` → wadah.

**19–24.** judul `Featured Kameko` + deskripsi (sama pola seperti section lain).

**25.** baris kosong.

**26.** `<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">`
→ Grid: 1 kolom (mobile), 2 (tablet), 3 (layar besar).

**27.** `{sorted.map((k) => (`
→ Looping tiap kameko `k` dari `sorted` (yang sudah diurutkan).

**28.** `<Card key={k.id} className="items-center text-center py-6">`
→ Kartu per kameko, konten rata tengah.

**29.** `<CardContent className="flex flex-col items-center gap-3 px-6">`
→ Isi kartu disusun vertikal, tengah, jarak antar elemen.

**30.** baris kosong.

**31.** `<Avatar className="size-20 text-xl font-semibold">`
→ Avatar (lingkaran foto) 80px, teks besar.

**32.** `<AvatarFallback className="bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white">`
→ Pengganti foto (karena belum ada foto): lingkaran gradasi ungu + teks putih.
`Fallback` ditampilkan saat tidak ada gambar.

**33.** `{initials(k.name)}`
→ Inisial nama (misal "Bima Aditama" → "BA") dari helper `initials`.

**34.** `</AvatarFallback>`

**35.** `</Avatar>`

**36.** baris kosong.

**37.** `<div className="space-y-1">`
→ Wadah nama + kota, jarak antar baris kecil.

**38.** `<p className="flex items-center justify-center gap-1 font-semibold">`
→ Baris nama: sejajar, tengah, tebal, jarak kecil (untuk ikon verifikasi).

**39.** `{k.name}`
→ Nama fotografer.

**40.** `{k.verified && (`
→ KONDISI SINGKAT: kalau `verified` true, tampilkan ikon di bawah. Kalau
false, tidak tampil apa pun (karena `&&`).

**41.** `<BadgeCheck className="size-4 text-blue-600" aria-label="Terverifikasi" />`
→ Ikon centang biru = tandat terverifikasi. `aria-label` = label untuk
pembaca layar (aksesibilitas).

**42.** `)}` → tutup blok `{k.verified && (...)}`.

**43.** `</p>`

**44.** `<p className="text-sm text-muted-foreground">{k.city}</p>`
→ Kota (kecil, redup).

**45.** `</div>`

**46.** baris kosong.

**47.** `<div className="flex flex-wrap justify-center gap-1.5">`
→ Wadah lencana gaya foto; boleh pindah baris (`flex-wrap`).

**48.** `{k.styles.map((s) => (`
→ Looping gaya foto (`styles`) jadi lencana.

**49.** `<Badge key={s} variant="secondary">`
→ Lencana gaya, `key={s}` penanda unik loop.

**50.** `{s}` → teks gaya.

**51.** `</Badge>`

**52.** `))}` → tutup map.

**53.** `{k.isAd && <Badge variant="default">Iklan</Badge>}`
→ Kalau `isAd` true, tampilkan lencana "Iklan" (gaya penuh/berisi warna).

**54.** `</div>`

**55.** baris kosong.

**56.** `<div className="flex items-center gap-1 text-sm">`
→ Baris rating: sejajar, ukuran kecil.

**57.** `<Star className="size-4 fill-amber-400 text-amber-400" />`
→ Ikon bintang kuning (terisi penuh karena `fill-amber-400`).

**58.** `<span className="font-medium">{k.rating.toFixed(1)}</span>`
→ Angka rating, 1 angka di belakang koma. `toFixed(1)` = 4.9, 4.8, dst.

**59.** `<span className="text-muted-foreground">({k.reviews})</span>`
→ Jumlah ulasan dalam kurung, redup.

**60.** `</div>`

**61.** baris kosong.

**62.** `<p className="text-sm text-muted-foreground">`
→ Paragraf harga.

**63.** `Mulai <span className="font-medium text-foreground">{formatRupiah(k.priceFrom)}</span>`
→ Teks "Mulai" + harga termurah diformat Rupiah oleh `formatRupiah`
(150000 → "Rp150.000").

**64.** `</p>`

**65.** `</CardContent>`

**66.** `</Card>`

**67.** `))}` → tutup map.

**68.** `</div>` → tutup grid.
**69.** `</div>` → tutup wadah.
**70.** `</section>` → tutup section.
**71.** `);` → tutup return.
**72.** `}` → tutup fungsi.

---

## 9. `components/home/gallery.tsx` — section galeri

**Untuk apa:** grid hasil foto (masih placeholder warna), dari data seed.

**1.** `import { Badge } from "@/components/ui/badge";`
**2.** `import { galleryItems } from "@/lib/seed";`
→ Ambil data galeri dari seed.

**4.** `export function Gallery() {` → komponen galeri.
**5.** `return (` → mulai tampilan.

**6.** `<section id="galeri" className="py-16 sm:py-20">`
→ Section ber-id `galeri`.

**7–13.** wadah + judul `Galeri Unggulan` + deskripsi (pola sama).

**14.** baris kosong.

**15.** `<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">`
→ Grid: 2 … 4 kolom tergantung lebar layar.

**16.** `{galleryItems.map((g) => (`
→ Looping tiap item galeri `g`.

**17.** `<figure`
→ Tag `<figure>` (elemen HTML untuk gambar + caption).

**18.** `key={g.id}`
→ Penanda unik loop.

**19.** `` className={`relative aspect-[3/4] overflow-hidden rounded-xl bg-gradient-to-br ${g.gradient}`} ``
→ Class kartu foto: rasio 3:4 (potret), sudut membulat, latar gradasi
dengan warna dari data `g.gradient`.

**20.** `>`

**21.** `<figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10 p-3 text-left text-white">`
→ Caption di bawah kartu: menempel bawah, latar gradasi gelap (transparan
ke pekat ke bawah) supaya teks terbaca, teks putih.

**22.** `<p className="font-semibold leading-tight">{g.title}</p>`
→ Judul foto.

**23.** `<p className="text-sm opacity-90">{g.cosplayer}</p>`
→ Nama cosplayer (sedikit transparan).

**24–26.** `<Badge variant="secondary" className="mt-1 bg-white/20 text-white hover:bg-white/20">`
→ Lencana genre, latar semi-transparan di atas foto.

**27.** `{g.genre}` → teks genre.
**28.** `</Badge>`
**29.** `</figcaption>`
**30.** `</figure>`
**31.** `))}` → tutup map.
**32.** `</div>` → tutup grid.
**33.** `</div>` → tutup wadah.
**34.** `</section>` → tutup section.
**35.** `);` → tutup return.
**36.** `}` → tutup fungsi.

---

## 10. `components/home/how-it-works.tsx` — section cara kerja

**Untuk apa:** 3 kartu langkah (Temukan → Booking → Terima Hasil).

**1.** `import { Search, CalendarCheck, ImageDown } from "lucide-react";`
→ Ambil 3 ikon (kaca pembesar, kalender-centang, panah-unduh).

**2.** baris kosong.
**3.** `import { Card, CardContent } from "@/components/ui/card";`
→ Kartu.

**4.** baris kosong.

**5.** `const steps = [`
→ Array berisi data 3 langkah (judul + deskripsi + ikon). Menulis data di
array (bukan hardcode di JSX) bikin JSX pendek & mudah di-loop.

**6.** `{` → buka object langkah 1.

**7.** `icon: Search,`
→ Properti `icon` berisi IKON (komponen) `Search`. Di JS, komponen bisa
disimpan sebagai nilai seperti ini.

**8.** `title: "Temukan",` → judul langkah 1.
**9.** `desc: "Cari fotografer cosplay ...",` → deskripsi langkah 1.
**10.** `},` → tutup object langkah 1.

**11–15.** object langkah 2 (`CalendarCheck`, "Booking Transparan", …).
**16–20.** object langkah 3 (`ImageDown`, "Terima Hasil", …).

**21.** `];` → tutup array.

**23.** `export function HowItWorks() {` → komponen.
**24.** `return (` → mulai tampilan.

**25.** `<section id="cara-kerja" className="bg-muted/40 py-16 sm:py-20">`
→ Section latar abu.

**26–30.** wadah + judul `Cara Kerja` + deskripsi.

**32.** `<div className="grid gap-4 md:grid-cols-3">`
→ Grid 3 kolom (mulai layar sedang).

**33.** `{steps.map((s, i) => (`
→ Looping langkah, `s` = object langkah, `i` = index (0,1,2).

**34.** `<Card key={s.title} className="py-6">`
→ Kartu, key = judul (unik).

**35.** `<CardContent className="space-y-3 px-6">`
→ Isi kartu.

**36.** `<div className="flex items-center gap-2">`
→ Baris nomor + ikon.

**37.** `<span className="flex size-8 items-center justify-center rounded-lg bg-primary font-semibold text-primary-foreground">`
→ Kotak nomor: 32px, membulat, latar warna utama, teks kontras.

**38.** `{i + 1}`
→ Nomor urut: index mulai dari 0, jadi `i + 1` = 1, 2, 3.

**39.** `</span>`

**40.** `<s.icon className="size-5 text-muted-foreground" />`
→ Render ikon langkah. `s.icon` = komponen ikon yang disimpan di data
(misal `Search`). Ditulis `<s.icon />` = "komponen yang tersimpan di
properti `icon`".

**41.** `</div>`

**42.** `<p className="font-semibold">{s.title}</p>`
→ Judul langkah.

**43.** `<p className="text-sm text-muted-foreground">{s.desc}</p>`
→ Deskripsi langkah.

**44.** `</CardContent>`
**45.** `</Card>`
**46.** `))}` → tutup map.
**47.** `</div>` → tutup grid.
**48.** `</div>` → tutup wadah.
**49.** `</section>` → tutup section.
**50.** `);` → tutup return.
**51.** `}` → tutup fungsi.

---

## 11. `components/home/packages.tsx` — section paket (BACA DATABASE)

**Untuk apa:** menampilkan daftar paket harga. Khusus section ini tidak pakai
data seed — dia membaca SUPABASE (database). Kemampuan baru yang dipelajari.

**1.** `import { Check } from "lucide-react";`
→ Ikon centang untuk daftar fitur.

**2.** baris kosong.
**3.** `import { Badge } from "@/components/ui/badge";`
**4.** `import { Card, CardContent } from "@/components/ui/card";`
**5.** `import { createClient } from "@/lib/supabase/server";`
→ Ambil `createClient` versi SERVER. Karena komponen ini SERVER COMPONENT
(tidak ada "use client"), ia pakai client server.

**6.** `import { formatRupiah, paketList } from "@/lib/seed";`
→ Ambil helper format Rupiah + data `paketList` (dipakai sebagai cadangan).

**7.** baris kosong.

**8.** `export async function Packages() {`
→ Komponen, ditandai `async`. `async` = fungsi ini boleh `await` (menunggu
pekerjaan lambat seperti baca database).

**9.** `const supabase = await createClient();`
→ Bikin client Supabase, TUNGGU sampai siap. `await` = jangan lanjut sebelum
selesai.

**10.** baris kosong.

**12.** `const { data, error } = await supabase`
→ Buka hasil query ke variabel `data` dan `error`. `await supabase` =
tunggu hasil query. Supabase SELALU mengembalikan pasangan { data, error }.

**13.** `.from("packages")`
→ Tentukan TABEL tujuan: `packages`.

**14.** `.select("name, price, description, features")`
→ Ambil kolom apa saja (nama, harga, deskripsi, fitur).

**15.** `.eq("is_active", true)`
→ Filter: hanya baris yang `is_active = true`. `eq` = "sama dengan".
Filter aktif = jangan tampilkan paket yang dinonaktifkan.

**16.** `.order("sort_order");`
→ Urutkan menaik menurut kolom `sort_order` (angka urut tampil).

**17.** baris kosong.

**18.** `const shown: { name: string; price: number; desc: string; features: string[] }[] =`
→ Siapkan variabel `shown` yang akan dirender. Bagian setelah `:` adalah
TIPE (TypeScript): array berisi object dengan 4 properti berjenis tertentu.

**19.** `!error && data && data.length > 0`
→ Syarat pakai hasil database: TIDAK ada `error`, DAN `data` ada, DAN
jumlah datanya lebih dari 0. Kalau semua benar, pakai hasil query;
kalau tidak, pakai cadangan.

**20.** `? data`
→ Kalau syarat terpenuhi, mulai dari array `data` hasil query.

**21.** `.filter((p) => p.price != null)`
→ Buang baris yang harganya `null` (paket "Community Project" = harga
custom). Sebab tampilan butuh angka harga.

**22.** `.map((p) => ({`
→ Ubah tiap baris jadi bentuk yang dibutuhkan tampilan.

**23.** `name: p.name,`
→ Properti `name` diambil dari `p.name`.
**24.** `price: p.price,`
**25.** `desc: p.description,`
→ PERHATIAN: kolom di database bernama `description`, tapi tampilan butuh
`desc`. Di sinilah keduanya diselaraskan.
**26.** `features: p.features ?? [],`
→ Ambil `features`; kalau `null`, pakai array kosong supaya tidak error.
**27.** `}))`
→ Tutup map.
**28.** `: paketList;`
→ Kalau syarat baris 19 gagal (database kosong/error), pakai data seed.

**29.** komentar `// fallback: ...`

**30.** baris kosong.
**31.** `return (` → mulai tampilan.

**32.** `<section id="paket" className="py-16 sm:py-20">`
→ Section ber-id `paket`.

**33–38.** wadah + judul `Paket & Harga` + deskripsi.

**39.** baris kosong.

**40.** `<div className="grid gap-4 md:grid-cols-3">`
→ Grid 3 kolom (mulai layar sedang).

**41.** `{shown.map((p) => (`
→ Looping tiap paket `p` dari `shown`.

**42.** `<Card key={p.name} className="py-6">`
→ Kartu, key = nama paket.

**43.** `<CardContent className="space-y-4 px-6">`
→ Isi kartu.

**44.** `<div className="space-y-1">`
→ Wadah nama + harga + deskripsi.

**45.** `<Badge variant="secondary">{p.name}</Badge>`
→ Lencana nama paket.

**46.** `<p className="text-3xl font-bold">{formatRupiah(p.price)}</p>`
→ Harga besar + tebal, diformat Rupiah.

**47.** `<p className="text-sm text-muted-foreground">{p.desc}</p>`
→ Deskripsi paket.

**48.** `</div>`

**49.** `<ul className="space-y-2 text-sm">`
→ Daftar fitur (unordered list `<ul>` — daftar berbutir).

**50.** `{p.features.map((f) => (`
→ Looping tiap fitur `f`.

**51.** `<li key={f} className="flex items-center gap-2">`
→ Item daftar, sejajar dengan ikon.

**52.** `<Check className="size-4 text-green-600" />`
→ Ikon centang hijau.

**53.** `{f}` → teks fitur.
**54.** `</li>`
**55.** `))}` → tutup map fitur.
**56.** `</ul>`
**57.** `</CardContent>`
**58.** `</Card>`
**59.** `))}` → tutup map paket.
**60.** `</div>` → tutup grid.

**61.** baris kosong.

**62.** `<p className="mt-6 text-center text-sm text-muted-foreground">`
→ Catatan bawah.

**63.** `Punya proyek grup / event? Tersedia paket <strong>Community Project</strong> — hubungi admin.`
→ Teks + `<strong>` (tebal) untuk nama paket community.

**64.** `</p>`
**65.** `</div>` → tutup wadah.
**66.** `</section>` → tutup section.
**67.** `);` → tutup return.
**68.** `}` → tutup fungsi.

**Poin penting yang dipelajari:**
- `async` + `await` = menunggu pekerjaan lambat (query database).
- `{ data, error }` = pola Supabase yang selalu sama.
- `.map` + `.filter` = menyaring & menyelaraskan bentuk data.
- Rantai `.from().select().eq().order()` = bahasa query Supabase.

---

## 12. `lib/utils.ts` — helper cn()

**Untuk apa:** fungsi kecil penggabung class Tailwind. Dipakai hampir semua
komponen UI.

**1.** `import { clsx, type ClassValue } from "clsx";`
→ Ambil `clsx` (penggabung class) + tipe `ClassValue`.

**2.** `import { twMerge } from "tailwind-merge";`
→ Ambil `twMerge` (membuang class Tailwind yang saling konflik).

**4–10.** komentar menjelaskan: `cn()` gabungkan class lalu buang konflik.

**11.** `export function cn(...inputs: ClassValue[]) {`
→ Fungsi `cn` menerima BANYAK argumen (`...` = rest, kumpulkan semua jadi
array `inputs`).

**12.** `return twMerge(clsx(inputs));`
→ Gabungkan inputs pakai `clsx` (menangani kondisional seperti
`cond && "p-4"`), lalu `twMerge` buang konflik (misal dua warna latar yang
bertabrakan — yang terakhir menang).

**13.** `}`

Contoh: `cn("p-4", true && "bg-red-500", false && "bg-blue-500")`
→ `"p-4 bg-red-500"`.

---

## 13. `lib/seed.ts` — data contoh

**Untuk apa:** data sementara supaya halaman bisa tampil sebelum database
penuh. Ditandai `ponytail:` (nanti dihapus/diabaikan saat data asli lengkap).

**1–10.** komentar besar menjelaskan tujuan file + catatan `ponytail`.

**12.** `export type Cosplayer = {`
→ Buat TIPE bernama `Cosplayer` (bentuk data cosplayer). `type` = cetakan
bentuk object, membantu TypeScript mendeteksi kesalahan.

**13.** `id: string;` → properti id bertipe teks.
**14.** `name: string;` → nama.
**15.** `handle: string;` → nama unik (tag @).
**16.** `city: string;` → kota.
**17.** `genre: string;` → genre.
**18.** `};` → tutup tipe.

**20–30.** tipe `Kameko`: id, name, city, `styles: string[]` (ARRAY teks),
`rating: number` (angka), `reviews: number`, `priceFrom: number`, 
`verified: boolean` (true/false), `isAd: boolean` (iklan — REQ-033).

**32–38.** tipe `GalleryItem`: id, title, cosplayer, genre, `gradient: string`.

**40–45.** tipe `Paket`: name, price, desc, `features: string[]`.

**47–50.** komentar `Intl.NumberFormat` = fitur bawaan, bukan library.

**51.** `const rupiah = new Intl.NumberFormat("id-ID", {`
→ Bikin pemformat angka lokalisasi Indonesia. `Intl.NumberFormat` = API
bawaan JavaScript/Node untuk format angka/uang.

**52.** `style: "currency",` → format sebagai MATA UANG.
**53.** `currency: "IDR",` → mata uang Rupiah.
**54.** `maximumFractionDigits: 0,` → tanpa angka di belakang koma.
**55.** `});`

**57.** `export function formatRupiah(n: number): string {`
→ Fungsi: terima angka `n`, kembalikan teks Rupiah.

**58.** `return rupiah.format(n);`
→ Format pakai `rupiah` di atas. `150000` → `"Rp150.000"`.

**59.** `}`

**61.** komentar `// inisial nama ...`

**62.** `export function initials(name: string): string {`
→ Fungsi: terima nama, kembalikan inisial (maksimal 2 huruf).

**63.** `return name`
→ Mulai dari `name`.

**64.** `.split(" ")`
→ Pecah nama per spasi: `"Alya Putri"` → `["Alya", "Putri"]`.

**65.** `.filter(Boolean)`
→ Buang potongan kosong (melindungi dari spasi ganda).

**66.** `.slice(0, 2)`
→ Ambil paling banyak 2 kata pertama.

**67.** `.map((w) => w[0])`
→ Untuk tiap kata, ambil huruf pertama: `["A", "P"]`.

**68.** `.join("")`
→ Gabung jadi satu teks: `"AP"`.

**69.** `.toUpperCase();`
→ Jadikan huruf besar.

**70.** `}`

**72.** `export const featuredCosplayers: Cosplayer[] = [`
→ Array data cosplayer, bertipe `Cosplayer[]` (array dari Cosplayer).

**73–80.** item data (8 cosplayer). Tiap `{ ... }` = satu object berisi
id, name, handle, city, genre. Baris data, tidak ada logika.

**81.** `];`

**83.** `export const featuredKamekos: Kameko[] = [`
→ Array data kameko, bertipe `Kameko[]`.

**84–89.** item data (6 kameko), tiap object berisi semua properti dari tipe
`Kameko` (termasuk `styles: [...]` array, `verified`, `isAd`).

**90.** `];`

**92.** `export const galleryItems: GalleryItem[] = [`
→ Array data galeri.

**93–100.** item data (8 foto), tiap object berisi title, cosplayer, genre,
gradient (class warna Tailwind).

**101.** `];`

**103–107.** komentar menjelaskan harga paket ditentukan PLATFORM (seragam).

**108.** `export const paketList: Paket[] = [`
→ Array paket (dipakai sebagai CADANGAN di packages.tsx kalau database gagal).

**109–114.** paket Quick Session: name, price, desc, `features` (array).
**115–120.** paket Standard.
**121–126.** paket Premium.
**127.** `];`

---

## 14. `lib/supabase/client.ts` — client untuk browser

**Untuk apa:** koneksi Supabase yang dipakai di Client Component (ada di
browser). Kunci di sini PUBLIK (aman dipakai browser, telah dibatasi RLS).

**1.** `"use client";`
→ Menandai file ini Client Component. Dipakai dari komponen client.

**2.** baris kosong.

**3.** `import { createBrowserClient } from "@supabase/ssr";`
→ Ambil pembuat client versi browser dari library `@supabase/ssr`.

**4.** `export function createClient() {`
→ Fungsi pembuat client.

**5.** `return createBrowserClient(`
→ Buat & kembalikan client browser.

**6.** `process.env.NEXT_PUBLIC_SUPABASE_URL!,`
→ Alamat proyek Supabase, dibaca dari variabel environment
`.env.local`. Tanda `!` = "pastikan bukan null" (nilai memang diisi).
`NEXT_PUBLIC_` = variabel yang BOLEH dibaca browser.

**7.** `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!`
→ Kunci anon (publik) untuk autentikasi request dari browser.

**8.** `);`
**9.** `}`

---

## 15. `lib/supabase/server.ts` — client untuk server

**Untuk apa:** koneksi Supabase untuk Server Component. Bedanya: ia mengelola
cookie sesi login secara otomatis.

**1.** `import "server-only";`
→ Menjaga agar file ini HANYA bisa dipakai dari server. Kalau ada komponen
client mencoba import, build GAGAL — mencegah kunci/sesi bocor ke browser.

**2.** `import { createServerClient } from "@supabase/ssr";`
→ Pembuat client versi server.

**3.** `import { cookies } from "next/headers";`
→ Ambil fungsi `cookies()` milik Next.js untuk baca/tulis cookie sepanjang
permintaan.

**4.** baris kosong.
**5.** baris kosong.

**6.** `export async function createClient() {`
→ Fungsi `async` pembuat client server.

**7.** `const cookieStore = await cookies();`
→ Ambil akses cookie, TUNGGU sampai siap (`await`). Cookie dipakai untuk
menyimpan sesi login pengguna.

**8.** baris kosong.

**9.** `return createServerClient(`
→ Buat client server.

**10–11.** `process.env.NEXT_PUBLIC_SUPABASE_URL!` dan `..._ANON_KEY!`
→ Alamat + kunci, sama seperti client browser (dibaca dari `.env.local`).

**12.** `{` → buka object pengaturan.

**13.** `cookies: {` → pengaturan penanganan cookie.

**14.** `getAll() {` → fungsi baca semua cookie.

**15.** `return cookieStore.getAll();`
→ Kembalikan semua cookie (dipakai Supabase untuk tahu pengguna login/tidak).

**16.** `},`

**17.** `setAll(cookiesToSet) {` → fungsi menulis cookie (saat login/logout
Supabase menyimpan/memperbarui cookie sesi).

**18.** `try {` → coba jalankan; kalau gagal, tangani tanpa merusak halaman.

**19.** `cookiesToSet.forEach(({ name, value, options }) =>`
→ Untuk tiap cookie yang mau ditulis, ambil nama, nilai, dan opsi-nya.

**20.** `cookieStore.set(name, value, options)`
→ Tulis cookie sebenarnya.

**21.** `);`

**22.** `} catch {`
→ Kalau menulis cookie gagal (misal saat proses di server tidak mengizinkan),
jangan bikin error — lewati.

**23.** baris kosong (sengaja kosong = "lakukan apa-apa").
**24.** `}`

**25.** `},`
**26.** `},` → tutup pengaturan cookie.
**27.** `}` → tutup object pengaturan.
**28.** `);` → tutup createServerClient.
**29.** `}` → tutup fungsi.

---

## 16. `package.json` — konfigurasi & dependency

**Untuk apa:** daftar pustaka terpasang + perintah npm (script).

**1–4.** `name`, `version`, `private` → identitas project; `private: true`
artinya tidak akan di-publish ke registry npm.

**5–10.** `scripts` → perintah singkat. Artinya:
- `npm run dev` = jalankan server pengembangan (`next dev`).
- `npm run build` = build produksi (`next build`).
- `npm run start` = jalankan hasil build (`next start`).
- `npm run lint` = cek kode (`eslint`).

**11–28.** `dependencies` → pustaka yang dipakai SAAT APLIKASI JALAN:
- `@radix-ui/react-*` = dasar komponen (avatar, label, select, separator, slot).
- `@supabase/ssr` = client Supabase untuk Next.js.
- `@supabase/supabase-js` = inti SDK Supabase.
- `class-variance-authority` = bikin varian komponen (dipakai shadcn).
- `clsx` + `tailwind-merge` = helper `cn()`.
- `lucide-react` = ikon.
- `next` / `react` / `react-dom` = inti framework.
- `server-only` = penjaga file server.
- `tw-animate-css` = animasi Tailwind.

**29–38.** `devDependencies` → pustaka yang dipakai SAAT PENGEMBANGAN saja:
- `tailwindcss` + `@tailwindcss/turbopack` = Tailwind.
- `typescript` = pemeriksa tipe.
- `eslint` + `eslint-config-next` = pemeriksa gaya/kesalahan kode.
- `@types/*` = tipe TypeScript untuk Node & React.

---

## 17. Rujukan lanjut

- Skema database (tabel, kolom, trigger, RLS) dijelaskan baris per baris di
  `Modul-Belajar-Supabase.md` (file project).
- Konsep dasar Next.js di `Modul-Belajar-Nextjs.md` (bila tersedia).

**Saran belajar:** jangan baca semua sekaligus. Petakan: buka `app/page.tsx`
→ ikuti komponen yang di-import → buka file komponennya satu per satu sambil
melihat `lib/seed.ts` (sumber data) dan `lib/supabase/*` (koneksi database).