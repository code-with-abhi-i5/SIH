import { cn } from "@/lib/utils";

export function Logo({ className, showText = true, size = "md", variant = "dark" }) {
  const sizes = {
    sm: { icon: 28, text: "text-base" },
    md: { icon: 36, text: "text-lg" },
    lg: { icon: 44, text: "text-xl" },
  };

  const s = sizes[size];

  return (
    <div className={cn("flex items-center gap-2.5", className)} aria-label="JanSamadhan">
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="40" height="40" rx="10" fill={variant === "dark" ? "#0f1729" : "#ffffff"} />
        <path
          d="M20 8C20 8 12 16 12 22C12 26.4 15.6 30 20 30C24.4 30 28 26.4 28 22C28 16 20 8 20 8Z"
          fill="#e8850c"
        />
        <circle cx="20" cy="22" r="4" fill={variant === "dark" ? "#ffffff" : "#0f1729"} />
        <path d="M20 30L16 36H24L20 30Z" fill="#16a34a" opacity="0.9" />
        <circle cx="14" cy="18" r="2" fill="white" opacity="0.5" />
        <circle cx="26" cy="18" r="2" fill="white" opacity="0.5" />
      </svg>
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={cn(
              s.text,
              "font-bold tracking-tight",
              variant === "dark" ? "text-navy-900" : "text-white"
            )}
          >
            JanSamadhan
          </span>
          {size !== "sm" && (
            <span
              className={cn(
                "text-[10px] font-medium tracking-wide uppercase mt-0.5",
                variant === "dark" ? "text-navy-500" : "text-navy-300"
              )}
            >
              Civic Innovation
            </span>
          )}
        </div>
      )}
    </div>
  );
}
