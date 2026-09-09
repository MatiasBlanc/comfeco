import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-md border border-white/10 bg-black/25 px-3 py-2 text-base text-white outline-none transition placeholder:text-zinc-600 hover:border-white/20 focus-visible:border-cyan-300/70 focus-visible:ring-2 focus-visible:ring-cyan-300/15 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
