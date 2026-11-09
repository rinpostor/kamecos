import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { formatRupiah, paketList } from "@/lib/seed";

export async function Packages() {
  const supabase = await createClient();

 
  const { data, error } = await supabase
    .from("packages")
    .select("name, price, description, features")
    .eq("is_active", true)
    .order("sort_order");

  const shown: { name: string; price: number; desc: string; features: string[] }[] =
    !error && data && data.length > 0
      ? data
          .filter((p) => p.price != null)
          .map((p) => ({
            name: p.name,
            price: p.price,
            desc: p.description,
            features: p.features ?? [],
          }))
      : paketList; // fallback: kalau tabel kosong/gagal, tampilkan data contoh

  return (
    <section id="paket" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Paket &amp; Harga</h2>
          <p className="mt-2 text-muted-foreground">
            Harga sama untuk semua fotografer — kamu pilih paketnya, bukan tawarnya.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {shown.map((p) => (
            <Card key={p.name} className="py-6">
              <CardContent className="space-y-4 px-6">
                <div className="space-y-1">
                  <Badge variant="secondary">{p.name}</Badge>
                  <p className="text-3xl font-bold">{formatRupiah(p.price)}</p>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                </div>
                <ul className="space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="size-4 text-green-600" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Punya proyek grup / event? Tersedia paket <strong>Community Project</strong> — hubungi admin.
        </p>
      </div>
    </section>
  );
}