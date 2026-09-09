"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      theme="dark"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: "!border-white/10 !bg-[#10141b] !text-white",
          description: "!text-zinc-400",
          error: "!border-red-400/30",
        },
      }}
    />
  );
}
