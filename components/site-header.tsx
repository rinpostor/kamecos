import { Button } from "@/components/ui/button";
import { Camera, Menu } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo: ikon + nama brand */}
        <a href="#" className="flex items-center gap-2 font-semibold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Camera className="size-4" />
          </span>
          Kamecos
        </a>

        {/* Nav desktop (dipusatkan absolut biar selalu di tengah) */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 text-sm md:flex">
          <a href="#cosplayer" className="text-muted-foreground hover:text-foreground transition-colors">
            Cosplayer
          </a>
          <a href="#kameko" className="text-muted-foreground hover:text-foreground transition-colors">
            Fotografer
          </a>
          <a href="#galeri" className="text-muted-foreground hover:text-foreground transition-colors">
            Galeri
          </a>
          <a href="#paket" className="text-muted-foreground hover:text-foreground transition-colors">
            Paket
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            Masuk
          </Button>
          <Button size="sm">Daftar Gratis</Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}