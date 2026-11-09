import { Badge } from "@/components/ui/badge";
import { galleryItems } from "@/lib/seed";

export function Gallery() {
  return (
    <section id="galeri" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Galeri Unggulan</h2>
          <p className="mt-2 text-muted-foreground">
            Cuplikan hasil foto dari sesi terbaru anggota Kamecos.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {galleryItems.map((g) => (
            <figure
              key={g.id}
              className={`relative aspect-[3/4] overflow-hidden rounded-xl bg-gradient-to-br ${g.gradient}`}
            >
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10 p-3 text-left text-white">
                <p className="font-semibold leading-tight">{g.title}</p>
                <p className="text-sm opacity-90">{g.cosplayer}</p>
                <Badge
                  variant="secondary"
                  className="mt-1 bg-white/20 text-white hover:bg-white/20"
                >
                  {g.genre}
                </Badge>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}