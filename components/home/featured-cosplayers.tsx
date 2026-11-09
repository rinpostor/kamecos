import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { featuredCosplayers } from "@/lib/seed";

const coverGradients = [
  "from-fuchsia-400 to-purple-500",
  "from-sky-400 to-indigo-500",
  "from-rose-400 to-red-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-violet-400 to-purple-600",
  "from-cyan-400 to-blue-500",
  "from-pink-400 to-fuchsia-500",
];

export function FeaturedCosplayers() {
  return (
    <section id="cosplayer" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Featured Cosplayer</h2>
          <p className="mt-2 text-muted-foreground">
            Cosplayer aktif dengan galeri hasil foto terbaru mereka.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {featuredCosplayers.map((c, i) => (
            <Card key={c.id} className="overflow-hidden py-0">
              <div
                className={`flex h-32 items-center justify-center bg-gradient-to-br text-4xl font-bold text-white sm:h-36 ${coverGradients[i % coverGradients.length]}`}
              >
                {c.name[0]}
              </div>
              <CardContent className="space-y-1.5 p-4">
                <p className="font-semibold leading-none">{c.name}</p>
                <p className="text-sm text-muted-foreground">
                  {c.handle} · {c.city}
                </p>
                <Badge variant="secondary">{c.genre}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}