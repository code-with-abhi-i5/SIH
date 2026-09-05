import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-navy-900 text-white hover:bg-navy-800 shadow-md shadow-navy-900/20 hover:shadow-lg hover:shadow-navy-900/25 active:scale-[0.98]",
        secondary:
          "bg-white text-navy-900 border border-navy-200 hover:bg-navy-50 hover:border-navy-300 active:scale-[0.98]",
        ghost:
          "text-navy-700 hover:bg-navy-100/60 hover:text-navy-900",
        saffron:
          "bg-saffron-500 text-white hover:bg-saffron-400 shadow-md shadow-saffron-500/20 active:scale-[0.98]",
        outline:
          "border-2 border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white active:scale-[0.98]",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-5",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

const Button = forwardRef(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
