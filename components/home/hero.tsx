import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-fuchsia-100/70 to-transparent dark:from-fuchsia-950/30" />

      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:py-28">
        <Badge variant="secondary" className="mb-4">
          <Sparkles className="size-3" />
          Khusus fotografi cosplay
        </Badge>

        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          Temukan fotografer yang paham konsep karaktermu
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Kamecos mempertemukan cosplayer dan fotografer cosplay — harga paket
          transparan, jadwal jelas, dan hasil foto terkelola dalam satu
          platform.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <a href="#kameko">Jelajahi Fotografer</a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#paket">Lihat Paket &amp; Harga</a>
          </Button>
        </div>
      </div>
    </section>
  );
}