import { cn } from "@/lib/utils";

/*
  Konsep: skeleton = kotak abu berdenyut (loading state).
  Dipakai Supabase nanti saat data belum sampai.
*/
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };