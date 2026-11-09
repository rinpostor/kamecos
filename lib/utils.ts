import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/*
  Konsep: Utility function (bukan fitur Next.js — cuma helper biasa).
  cn("bg-red-500", cond && "p-4") -> gabung class Tailwind,
  lalu twMerge buang class yang saling konflik (misal dua warna bg).
  Dipakai hampir di SEMUA component shadcn untuk menyatukan className
  bawaan component + className custom dari pemakainya.
*/
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}