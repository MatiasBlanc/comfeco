import type * as React from "react";

import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-zinc-300 transition-colors hover:border-cyan-300/25 hover:text-cyan-100",
        className,
      )}
      {...props}
    />
  );
}
