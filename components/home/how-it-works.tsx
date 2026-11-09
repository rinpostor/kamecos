import { Search, CalendarCheck, ImageDown } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    icon: Search,
    title: "Temukan",
    desc: "Cari fotografer cosplay berdasarkan lokasi dan gaya foto — semuanya terpusat di satu platform.",
  },
  {
    icon: CalendarCheck,
    title: "Booking Transparan",
    desc: "Pilih paket, tanggal, dan brief konsep. Harga jelas di depan, DP ditahan platform sampai dikonfirmasi.",
  },
  {
    icon: ImageDown,
    title: "Terima Hasil",
    desc: "Unduh foto HD dari client gallery, beri rating, dan tampilkan galeri hasilmu.",
  },
];

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="bg-muted/40 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Cara Kerja</h2>
          <p className="mt-2 text-muted-foreground">Tiga langkah dari pencarian sampai foto jadi.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <Card key={s.title} className="py-6">
              <CardContent className="space-y-3 px-6">
                <div className="flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <s.icon className="size-5 text-muted-foreground" />
                </div>
                <p className="font-semibold">{s.title}</p>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}