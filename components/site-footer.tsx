/* Konsep: footer = info bawah halaman. Murni presentasi. */
export function SiteFooter() {
  return (
    <footer className="border-t py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row">
        <p>© 2026 Kamecos. Semua hak dilindungi.</p>
        <p>Tampilan memakai data contoh (seed).</p>
      </div>
    </footer>
  );
}