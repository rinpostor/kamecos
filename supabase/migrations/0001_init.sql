-- ============================================================================
-- KAMECOS — Skema Database Supabase (migrasi awal)
-- ============================================================================
-- File ini DEFINISI database. Jalankan SEKALI di Supabase SQL Editor.
-- Urutan penting: enum -> tabel -> index -> fungsi -> trigger -> RLS -> grant.
--
-- Istilah cepat (dijelaskan lengkap di Modul-Belajar-Supabase.md):
--   enum        = daftar nilai yang diizinkan (misal status cuma boleh nilai tertentu)
--   tabel       = kumpulan baris data (seperti sheet di Excel)
--   kolom       = satu field di tabel
--   primary key = id unik tiap baris (PK)
--   foreign key = kolom yang menunjuk PK tabel lain (relasi)
--   RLS         = Row Level Security, pintu izin per baris data
--   trigger     = fungsi yang jalan OTOMATIS saat ada kejadian (misal user baru daftar)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. ENUM — daftar nilai tetap. Supaya status tidak bisa diisi nilai ngawur.
-- ----------------------------------------------------------------------------

-- peran pengguna: cosplayer = klien, kameko = fotografer cosplay
create type public.user_role as enum ('cosplayer', 'kameko', 'admin');

-- siklus hidup satu booking
create type public.booking_status as enum (
  'menunggu_konfirmasi',  -- cosplayer sudah booking, fotografer belum setuju
  'dikonfirmasi',         -- fotografer setuju
  'selesai',              -- sesi + hasil foto selesai
  'batal',                -- dibatalkan
  'sengketa'              -- ada masalah, butuh admin
);

-- status pembayaran (DP ditahan platform = escrow sederhana; lihat REQ-013)
create type public.payment_status as enum ('menunggu', 'dibayar', 'dikembalikan');

-- jenis pembayaran
create type public.payment_type as enum ('deposit', 'pelunasan');

-- payment gateway pilihan (PRD: Midtrans/Xendit)
create type public.payment_gateway as enum ('midtrans', 'xendit');

-- jenis transaksi wallet fotografer
create type public.wallet_txn_type as enum ('kredit', 'debit');

-- ----------------------------------------------------------------------------
-- 2. TABEL
-- ----------------------------------------------------------------------------

-- 2.1 PROFILES — profil semua pengguna (cosplayer DAN kameko dalam satu tabel).
-- Diisi OTOMATIS oleh trigger saat user daftar (lihat bagian 4).
-- Kolom khusus kameko (styles, is_verified, is_ad, rating) boleh NULL untuk cosplayer.
create table public.profiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  role            public.user_role not null default 'cosplayer',
  full_name       text not null,
  handle          text not null unique,          -- nama unik di URL, misal @allyaputri
  city            text,
  bio             text,
  avatar_url      text,

  -- === khusus kameko (fotografer) ===
  styles          text[] not null default '{}',   -- genre: {'Dark Fantasy','Pop/Bright'}
  is_verified     boolean not null default false, -- REQ-009 badge Verified (admin yang set)
  is_ad           boolean not null default false, -- REQ-033 kameko bayar iklan -> tampil paling depan
  ad_expires_at   timestamptz,                    -- kapan masa iklan habis
  rating_avg      numeric(2,1) not null default 0,-- dihitung otomatis oleh trigger rating
  rating_count    integer not null default 0,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 2.2 PACKAGES — paket harga. MILIK PLATFORM, sama untuk semua kameko (REQ-031:
-- kameko TIDAK menentukan harga sendiri). Admin/platform yang isi baris ini.
create table public.packages (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,      -- nama internal: 'quick-session'
  name           text not null,             -- nama tampil: 'Quick Session'
  price          integer,                   -- rupiah; NULL = harga custom (Community Project)
  duration_label text not null,             -- '1 jam sesi'
  photo_count    integer,                   -- jumlah foto; NULL untuk paket custom
  edited_count   integer,                   -- jumlah foto yang diedit
  revisions      integer,                   -- berapa kali revisi gratis
  description    text not null,
  features       text[] not null default '{}', -- daftar fitur buat ditampilkan
  is_active      boolean not null default true,
  sort_order     integer not null default 0,   -- urutan tampil
  created_at     timestamptz not null default now()
);

-- 2.3 PORTFOLIO_ITEMS — galeri portofolio kameko (REQ-006, REQ-004 detail fotografer)
create table public.portfolio_items (
  id         uuid primary key default gen_random_uuid(),
  kameko_id  uuid not null references public.profiles (id) on delete cascade,
  title      text not null,
  image_url  text not null,
  genre      text not null,   -- gaya foto: 'Dark Fantasy', 'Special Effects', dst
  created_at timestamptz not null default now()
);

-- 2.4 AVAILABILITY — jadwal ketersediaan kameko (REQ-008 manajemen jadwal,
-- REQ-010 kalender real-time). Satu baris = satu slot waktu yang bisa dibooking.
create table public.availability (
  id         uuid primary key default gen_random_uuid(),
  kameko_id  uuid not null references public.profiles (id) on delete cascade,
  slot_date  date not null,
  start_time time not null,
  end_time   time not null,
  is_booked  boolean not null default false,  -- true saat slot sudah dipesan
  created_at timestamptz not null default now(),
  unique (kameko_id, slot_date, start_time)   -- cegah slot dobel
);

-- 2.5 BOOKINGS — pesanan. Inti dari Epic C (REQ-011 alur booking, REQ-012
-- biaya transparan, REQ-013 DP ditahan, REQ-014 ruang brief).
create table public.bookings (
  id             uuid primary key default gen_random_uuid(),
  cosplayer_id   uuid not null references public.profiles (id),
  kameko_id      uuid not null references public.profiles (id),
  package_id     uuid not null references public.packages (id),
  availability_id uuid references public.availability (id), -- slot jadwal yang dipilih

  slot_date      date not null,
  start_time     time,
  end_time       time,
  brief          text,                -- REQ-014: brief konsep dari klien

  total_amount   integer not null,    -- total harga paket (rupiah)
  deposit_amount integer not null,    -- DP yang ditahan (bagian dari total)
  service_fee    integer not null,    -- komisi platform 5% (REQ-027)

  status         public.booking_status not null default 'menunggu_konfirmasi',
  progress_note  text,                -- REQ-018: catatan status editing ('editing','revisi',...)

  created_at     timestamptz not null default now(),
  confirmed_at   timestamptz,
  completed_at   timestamptz
);

-- 2.6 PAYMENTS — catatan pembayaran per booking (REQ-013 escrow, REQ-015 metode)
create table public.payments (
  id           uuid primary key default gen_random_uuid(),
  booking_id   uuid not null references public.bookings (id) on delete cascade,
  payment_type public.payment_type not null default 'deposit',
  amount       integer not null,
  status       public.payment_status not null default 'menunggu',
  gateway      public.payment_gateway,
  gateway_ref  text,                  -- id transaksi dari Midtrans/Xendit
  created_at   timestamptz not null default now()
);

-- 2.7 REVIEWS — rating & ulasan pasca sesi (REQ-020). Satu booking = satu ulasan.
create table public.reviews (
  id          uuid primary key default gen_random_uuid(),
  booking_id  uuid not null unique references public.bookings (id) on delete cascade,
  reviewer_id uuid not null references public.profiles (id), -- cosplayer yang menilai
  kameko_id   uuid not null references public.profiles (id), -- fotografer yang dinilai
  rating      integer not null check (rating between 1 and 5),
  comment     text,
  created_at  timestamptz not null default now()
);

-- 2.8 GALLERY_ITEMS — hasil foto / client gallery (REQ-017 kirim file besar,
-- REQ-021 galeri hasil, REQ-023 tagging foto).
create table public.gallery_items (
  id           uuid primary key default gen_random_uuid(),
  booking_id   uuid not null references public.bookings (id) on delete cascade,
  cosplayer_id uuid not null references public.profiles (id),
  kameko_id    uuid not null references public.profiles (id),
  image_url    text not null,
  is_edited    boolean not null default false,
  created_at   timestamptz not null default now()
);

-- 2.9 WALLET_TRANSACTIONS — saldo & pencairan fotografer (REQ-024). Admin yang
-- isi (payout manual H+2), fotografer hanya bisa LIHA.
create table public.wallet_transactions (
  id          uuid primary key default gen_random_uuid(),
  kameko_id   uuid not null references public.profiles (id),
  booking_id  uuid references public.bookings (id),
  amount      integer not null,
  txn_type    public.wallet_txn_type not null,
  status      text not null default 'selesai',
  description text,
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 3. INDEX — mempercepat pencarian pada kolom yang sering difilter
-- ----------------------------------------------------------------------------
create index idx_profiles_city     on public.profiles (city);
create index idx_profiles_role     on public.profiles (role);
create index idx_profiles_styles   on public.profiles using gin (styles); -- filter genre (REQ-001)
create index idx_portfolios_kameko on public.portfolio_items (kameko_id);
create index idx_availability_kmk  on public.availability (kameko_id, slot_date);
create index idx_bookings_kameko   on public.bookings (kameko_id);
create index idx_bookings_cos      on public.bookings (cosplayer_id);
create index idx_bookings_status   on public.bookings (status);

-- ----------------------------------------------------------------------------
-- 4. FUNGSI + TRIGGER (jalan otomatis)
-- ----------------------------------------------------------------------------

-- 4a. Saat user daftar lewat Supabase Auth (auth.users), otomatis buat baris
-- profil. security definer = dijalankan dengan izin pemilik, supaya bisa
-- menembus RLS saat insert.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, handle, role)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(new.email, '@', 1)),
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'handle'), ''),
      lower(split_part(new.email, '@', 1)) || '-' || left(new.id::text, 4)
    ),
    case coalesce(new.raw_user_meta_data ->> 'role', 'cosplayer')
      when 'kameko' then 'kameko'::public.user_role
      when 'admin'  then 'admin'::public.user_role
      else 'cosplayer'::public.user_role
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4b. Saat ulasan masuk/diubah/dihapus, hitung ulang rating rata-rata kameko
-- dan simpan ke kolom rating_avg / rating_count di profil.
create or replace function public.recalc_kameko_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_kameko_id uuid;
begin
  v_kameko_id := coalesce(new.kameko_id, old.kameko_id);
  update public.profiles
    set
      rating_avg   = coalesce((select avg(rating)::numeric(2,1) from public.reviews
                               where kameko_id = v_kameko_id), 0),
      rating_count = (select count(*) from public.reviews where kameko_id = v_kameko_id)
    where id = v_kameko_id;
  return coalesce(new, old);
end;
$$;

create trigger reviews_rating_sync
  after insert or update or delete on public.reviews
  for each row execute function public.recalc_kameko_rating();

-- ----------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) — pintu izin per BARIS data.
-- Tanpa policy, tabel yang RLS-nya aktif menolak semua akses dari aplikasi.
-- Peran akses:
--   anon          = pengunjung yang belum login
--   authenticated = user yang sudah login (auth.uid() = id user)
--   service_role  = admin/backend, lewat kunci rahasia (tidak lewat browser)
-- ----------------------------------------------------------------------------

alter table public.profiles            enable row level security;
alter table public.packages            enable row level security;
alter table public.portfolio_items     enable row level security;
alter table public.availability        enable row level security;
alter table public.bookings            enable row level security;
alter table public.payments            enable row level security;
alter table public.reviews             enable row level security;
alter table public.gallery_items       enable row level security;
alter table public.wallet_transactions enable row level security;

-- PROFILES: profil publik bisa dibaca semua (katalog butuh nama + kota).
-- Tapi email TIDAK ada di tabel ini, jadi tidak ada yang bocor.
create policy "profil_public_read" on public.profiles
  for select using (true);

-- user hanya boleh ubah profil dirinya sendiri
create policy "profil_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- PACKAGES: dibaca semua, TIDAK ada policy tulis (hanya platform yang isi —
-- lewat SQL Editor / service_role). Ini menjaga REQ-031 harga seragam.
create policy "paket_public_read" on public.packages
  for select using (true);

-- PORTFOLIO: publik bisa lihat; kameko pemilik yang kelola.
create policy "portofolio_public_read" on public.portfolio_items
  for select using (true);
create policy "portofolio_owner_write" on public.portfolio_items
  for insert with check (auth.uid() = kameko_id);
create policy "portofolio_owner_update" on public.portfolio_items
  for update using (auth.uid() = kameko_id);
create policy "portofolio_owner_delete" on public.portfolio_items
  for delete using (auth.uid() = kameko_id);

-- AVAILABILITY: jadwal bisa dilihat calon klien; hanya pemilik yang ubah.
create policy "jadwal_public_read" on public.availability
  for select using (true);
create policy "jadwal_owner_write" on public.availability
  for insert with check (auth.uid() = kameko_id);
create policy "jadwal_owner_update" on public.availability
  for update using (auth.uid() = kameko_id);
create policy "jadwal_owner_delete" on public.availability
  for delete using (auth.uid() = kameko_id);

-- BOOKINGS: hanya cosplayer & kameko yang terlibat yang bisa melihat.
-- insert: hanya klien (cosplayer) yang membuat booking.
create policy "booking_lihat_pihak_terkait" on public.bookings
  for select using (auth.uid() = cosplayer_id or auth.uid() = kameko_id);
create policy "booking_insert_cosplayer" on public.bookings
  for insert with check (auth.uid() = cosplayer_id);
create policy "booking_update_pihak_terkait" on public.bookings
  for update using (auth.uid() = cosplayer_id or auth.uid() = kameko_id)
  with check (auth.uid() = cosplayer_id or auth.uid() = kameko_id);

-- PAYMENTS: cuma pihak booking yang bisa lihat; klien yang memicu pembayaran.
create policy "pembayaran_lihat_pihak_terkait" on public.payments
  for select using (
    exists (
      select 1 from public.bookings b
      where b.id = payments.booking_id
        and (auth.uid() = b.cosplayer_id or auth.uid() = b.kameko_id)
    )
  );
create policy "pembayaran_insert_cosplayer" on public.payments
  for insert with check (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id and auth.uid() = b.cosplayer_id
    )
  );

-- REVIEWS: publik bisa baca (rating tampil di katalog); yang menulis = reviewer.
create policy "ulasan_public_read" on public.reviews
  for select using (true);
create policy "ulasan_insert_reviewer" on public.reviews
  for insert with check (auth.uid() = reviewer_id);
create policy "ulasan_update_reviewer" on public.reviews
  for update using (auth.uid() = reviewer_id);

-- GALLERY_ITEMS: galeri hasil bisa tampil publik; pemilik (cosplayer/kameko) yg kelola.
create policy "galeri_public_read" on public.gallery_items
  for select using (true);
create policy "galeri_owner_insert" on public.gallery_items
  for insert with check (auth.uid() = cosplayer_id or auth.uid() = kameko_id);
create policy "galeri_owner_update" on public.gallery_items
  for update using (auth.uid() = cosplayer_id or auth.uid() = kameko_id);

-- WALLET: PRIVAT — hanya kameko pemilik saldo yang bisa lihat. Tanpa policy tulis
-- (hanya admin/service_role yang isi payout).
create policy "wallet_lihat_pemilik" on public.wallet_transactions
  for select using (auth.uid() = kameko_id);

-- ----------------------------------------------------------------------------
-- 6. GRANT — beri izin dasar ke peran anon (belum login) & authenticated (login).
-- RLS di atas tetap membatasi BARIS mana yang bisa diakses. Ditulis eksplisit
-- supaya aman walau setting dashboard "expose new tables" mati.
-- ----------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;

-- tabel yang ditulis pengguna (RLS yang jaga kepemilikan baris)
grant insert, update, delete on public.profiles        to authenticated;
grant insert, update, delete on public.portfolio_items to authenticated;
grant insert, update, delete on public.availability    to authenticated;
grant insert, update         on public.bookings        to authenticated;
grant insert                on public.payments         to authenticated;
grant insert, update         on public.reviews         to authenticated;
grant insert, update         on public.gallery_items   to authenticated;

-- ----------------------------------------------------------------------------
-- 7. STORAGE — bucket buat file foto (REQ-017, REQ-030). Bucket 'public' = bisa
-- dibaca lewat URL langsung tanpa login. Policy tulis per-folder menyusul di
-- langkah fulfillment (untuk sekarang admin yang unggah lewat dashboard).
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values
  ('avatars',    'avatars',    true),
  ('portfolios', 'portfolios', true),
  ('galleries',  'galleries',  true)
on conflict (id) do nothing;

-- file di bucket public boleh dibaca semua orang
create policy "storage_public_read_avatars" on storage.objects
  for select using (bucket_id = 'avatars');
create policy "storage_public_read_portfolios" on storage.objects
  for select using (bucket_id = 'portfolios');
create policy "storage_public_read_galleries" on storage.objects
  for select using (bucket_id = 'galleries');

-- ----------------------------------------------------------------------------
-- 8. SEED — data awal. Paket harga PLATFORM (REQ-007/012/031) harus selalu ada.
-- ----------------------------------------------------------------------------
insert into public.packages
  (slug, name, price, duration_label, photo_count, edited_count, revisions, description, features, sort_order)
values
  ('quick-session', 'Quick Session', 150000, '1 jam sesi', 10, 10, 0,
   'Sesi singkat untuk konten IG/TikTok cepat.',
   array['1 jam sesi', '10 foto', 'Edit ringan', 'Kirim ≤ 3 hari'], 1),
  ('standard', 'Standard', 350000, '2–3 jam sesi', 25, 15, 1,
   'Paket paling pas untuk kebutuhan portofolio.',
   array['2–3 jam sesi', '25 foto (15 edit)', 'Konsultasi konsep', '1x revisi'], 2),
  ('premium', 'Premium', 750000, '4 jam sesi', 50, 25, 2,
   'Hasil maksimal untuk brand dan konten komersial.',
   array['4 jam sesi', '50 foto (25 edit)', '1 cetak HD', '2x revisi + lisensi'], 3),
  ('community-project', 'Community Project', null, 'Sesuai kebutuhan', null, null, null,
   'Proyek grup/event — hubungi admin.',
   array['Proyek grup/event', 'Diskusi khusus dengan admin'], 4)
on conflict (slug) do nothing;