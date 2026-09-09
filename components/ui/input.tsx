import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-md border border-[#D9D2DD]/25 bg-[#2F2F33]/35 px-3 py-2 text-base text-[#F3F1F4] outline-none transition placeholder:text-[#D9D2DD]/60 hover:border-[#D9D2DD]/45 focus-visible:border-[#F4C53A]/80 focus-visible:ring-2 focus-visible:ring-[#F4C53A]/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
