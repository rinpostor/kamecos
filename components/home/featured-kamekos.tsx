import { Star, BadgeCheck } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { featuredKamekos, formatRupiah, initials } from "@/lib/seed";


export function FeaturedKamekos() {
  // urutkan: iklan dulu, lalu rating tertinggi
  const sorted = [...featuredKamekos].sort((a, b) => {
    if (a.isAd !== b.isAd) return a.isAd ? -1 : 1;
    return b.rating - a.rating;
  });

  return (
    <section id="kameko" className="bg-muted/40 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Featured Kameko</h2>
          <p className="mt-2 text-muted-foreground">
            Fotografer cosplay pilihan, siap menerima booking.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((k) => (
            <Card key={k.id} className="items-center text-center py-6">
              <CardContent className="flex flex-col items-center gap-3 px-6">
  
                <Avatar className="size-20 text-xl font-semibold">
                  <AvatarFallback className="bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white">
                    {initials(k.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                  <p className="flex items-center justify-center gap-1 font-semibold">
                    {k.name}
                    {k.verified && (
                      <BadgeCheck className="size-4 text-blue-600" aria-label="Terverifikasi" />
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">{k.city}</p>
                </div>

                <div className="flex flex-wrap justify-center gap-1.5">
                  {k.styles.map((s) => (
                    <Badge key={s} variant="secondary">
                      {s}
                    </Badge>
                  ))}
                  {k.isAd && <Badge variant="default">Iklan</Badge>}
                </div>

                <div className="flex items-center gap-1 text-sm">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{k.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({k.reviews})</span>
                </div>

                <p className="text-sm text-muted-foreground">
                  Mulai <span className="font-medium text-foreground">{formatRupiah(k.priceFrom)}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}