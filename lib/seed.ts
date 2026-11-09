/*
  ============================================================
  SEED DATA (data contoh / dummy)
  Konsep: untuk sekarang UI pakai data lokal ini dulu,
  supaya halaman langsung tampil walau belum ada database.
  Nanti (tahap Supabase) data ini pindah ke database,
  dan file ini jadi bahan isi tabel.
  ponytail: hapus/abaikan file ini begitu data asli masuk dari Supabase.
  ============================================================
*/

export type Cosplayer = {
  id: string;
  name: string;
  handle: string;
  city: string;
  genre: string;
};

export type Kameko = {
  id: string;
  name: string;
  city: string;
  styles: string[];
  rating: number;
  reviews: number;
  priceFrom: number; // harga paket termurah, dalam Rupiah
  verified: boolean;
  isAd: boolean; // REQ-033: kameko beriklan tampil paling depan
};

export type GalleryItem = {
  id: string;
  title: string;
  cosplayer: string;
  genre: string;
  gradient: string; // class Tailwind untuk placeholder foto (belum ada foto asli)
};

export type Paket = {
  name: string;
  price: number;
  desc: string;
  features: string[];
};

/*
  Bantu format angka jadi Rupiah: 150000 -> "Rp150.000".
  Intl.NumberFormat = fitur bawaan browser/Node, bukan library.
*/
const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function formatRupiah(n: number): string {
  return rupiah.format(n);
}

/* Inisial nama untuk AvatarFallback: "Alya Putri" -> "AP" */
export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export const featuredCosplayers: Cosplayer[] = [
  { id: "c1", name: "Alya Putri", handle: "@alyaputri", city: "Jakarta", genre: "Dark Fantasy" },
  { id: "c2", name: "Valencia", handle: "@valencia.cos", city: "Jakarta", genre: "Pop/Bright" },
  { id: "c3", name: "Rizky Pratama", handle: "@rizkyprtm", city: "Bandung", genre: "Anime" },
  { id: "c4", name: "Nadine Maharani", handle: "@nadinemhr", city: "Jakarta", genre: "Fashion" },
  { id: "c5", name: "Gita Pertiwi", handle: "@gitapertiwi", city: "Bandung", genre: "Special Effects" },
  { id: "c6", name: "Maria Goreti", handle: "@maria.gore", city: "Kupang", genre: "Pop/Bright" },
  { id: "c7", name: "Chen Mei Ling", handle: "@meiling.cos", city: "Surabaya", genre: "Dark Fantasy" },
  { id: "c8", name: "Fatin Zahra", handle: "@fatinzahra", city: "Yogyakarta", genre: "Fashion" },
];

export const featuredKamekos: Kameko[] = [
  { id: "k1", name: "Bima Aditama", city: "Jakarta", styles: ["Dark Fantasy", "Gothic"], rating: 4.9, reviews: 32, priceFrom: 350000, verified: true, isAd: true },
  { id: "k2", name: "Raka Maulana", city: "Bandung", styles: ["Anime", "Pop/Bright"], rating: 4.8, reviews: 27, priceFrom: 250000, verified: true, isAd: false },
  { id: "k3", name: "Kevin Cahyadi", city: "Jakarta", styles: ["Special Effects", "Pop/Bright"], rating: 4.7, reviews: 19, priceFrom: 300000, verified: true, isAd: false },
  { id: "k4", name: "Alika Putri", city: "Yogyakarta", styles: ["Pop/Bright", "Fashion"], rating: 4.9, reviews: 41, priceFrom: 275000, verified: true, isAd: false },
  { id: "k5", name: "Yohanes Suryanto", city: "Surabaya", styles: ["Fashion", "Anime"], rating: 4.6, reviews: 14, priceFrom: 200000, verified: false, isAd: false },
  { id: "k6", name: "Ahmad Fauzan", city: "Bekasi", styles: ["Dark Fantasy", "Special Effects"], rating: 4.8, reviews: 22, priceFrom: 325000, verified: true, isAd: false },
];

export const galleryItems: GalleryItem[] = [
  { id: "g1", title: "Ratu Kegelapan", cosplayer: "Alya Putri", genre: "Dark Fantasy", gradient: "from-fuchsia-500 to-purple-700" },
  { id: "g2", title: "Magical Girl Spark", cosplayer: "Valencia", genre: "Pop/Bright", gradient: "from-pink-400 to-orange-400" },
  { id: "g3", title: "Jenderal Perang", cosplayer: "Rizky Pratama", genre: "Anime", gradient: "from-rose-500 to-red-700" },
  { id: "g4", title: "Elegance Noir", cosplayer: "Nadine Maharani", genre: "Fashion", gradient: "from-blue-500 to-indigo-700" },
  { id: "g5", title: "Naga Api", cosplayer: "Gita Pertiwi", genre: "Special Effects", gradient: "from-orange-500 to-red-600" },
  { id: "g6", title: "Bidadari Laut", cosplayer: "Maria Goreti", genre: "Pop/Bright", gradient: "from-cyan-400 to-blue-600" },
  { id: "g7", title: "Mystic Fox", cosplayer: "Chen Mei Ling", genre: "Dark Fantasy", gradient: "from-violet-500 to-indigo-700" },
  { id: "g8", title: "Cahaya Fajar", cosplayer: "Fatin Zahra", genre: "Fashion", gradient: "from-amber-400 to-yellow-500" },
];

/*
  REQ-007 + REQ-031: harga paket ditentukan PLATFORM (seragam untuk semua
  kameko). Jadi harga ini satu untuk semua, bukan harga per fotografer.
  Nilai = contoh sementara, sesuaikan saat kickoff.
*/
export const paketList: Paket[] = [
  {
    name: "Quick Session",
    price: 150000,
    desc: "Sesi singkat untuk konten IG/TikTok cepat.",
    features: ["1 jam sesi", "10 foto", "Edit ringan", "Kirim ≤ 3 hari"],
  },
  {
    name: "Standard",
    price: 350000,
    desc: "Paket paling pas untuk kebutuhan portofolio.",
    features: ["2–3 jam sesi", "25 foto (15 edit)", "Konsultasi konsep", "1x revisi"],
  },
  {
    name: "Premium",
    price: 750000,
    desc: "Hasil maksimal untuk brand dan konten komersial.",
    features: ["4 jam sesi", "50 foto (25 edit)", "1 cetak HD", "2x revisi + lisensi"],
  },
];