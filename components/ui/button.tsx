import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#8F3FD1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2F2F33] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-[#F4C53A]/70 bg-[#F0B500] text-[#2F2F33] shadow-[0_0_28px_rgba(143,63,209,0.28)] hover:border-[#F4C53A] hover:bg-[#F4C53A]",
        outline:
          "border border-[#D9D2DD]/35 bg-[#46146F]/25 text-[#F3F1F4] hover:border-[#F4C53A]/60 hover:bg-[#5E239E]/35",
        ghost: "text-[#D9D2DD] hover:bg-[#5E239E]/25 hover:text-[#F3F1F4]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-6 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { Button, buttonVariants };
