import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-32 w-full resize-y rounded-md border border-white/10 bg-black/25 px-3 py-3 text-base text-white outline-none transition placeholder:text-zinc-600 hover:border-white/20 focus-visible:border-cyan-300/70 focus-visible:ring-2 focus-visible:ring-cyan-300/15 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
