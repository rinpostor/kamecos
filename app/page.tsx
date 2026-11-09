import { Suspense } from "react";

import { Hero } from "@/components/home/hero";
import { FeaturedCosplayers } from "@/components/home/featured-cosplayers";
import { FeaturedKamekos } from "@/components/home/featured-kamekos";
import { Gallery } from "@/components/home/gallery";
import { HowItWorks } from "@/components/home/how-it-works";
import { Packages } from "@/components/home/packages";

/*
  Konsep: page.tsx di folder app/ = RUTING.
  app/page.tsx = alamat "/" (halaman utama).
  File ini SERVER COMPONENT (tanpa "use client") — dirender di server,
  jadi cepat + SEO bagus. Itu default di App Router.

  Isi halaman = susunan section. Urutan dashboard (REQ-032):
  (1) Featured Cosplayer -> (2) Featured Kameko -> (3) Gallery unggulan.
*/
export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedCosplayers />
      <FeaturedKamekos />
      <Gallery />
      <HowItWorks />
      {/*
        Konsep: <Suspense> = "bungkus bagian yang lambat".
        Packages membaca database (butuh waktu), jadi dibungkus Suspense
        dengan teks loading sementara. Section lain tetap dirender statis.
      */}
      <Suspense
        fallback={
          <section className="py-16 text-center text-sm text-muted-foreground">
            Memuat paket&hellip;
          </section>
        }
      >
        <Packages />
      </Suspense>
    </>
  );
}