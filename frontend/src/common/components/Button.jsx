import { Loader2 } from "lucide-react";

import { cn } from "../utils/cn";

const variants = {
  primary:
    "border-2 border-[#141414] bg-[#f3701e] text-[#141414] shadow-[4px_4px_0_#141414] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#141414] dark:border-[#e8d8c9] dark:bg-[#f3701e] dark:text-[#111111] dark:shadow-[4px_4px_0_#4b607f]",
  secondary:
    "border-2 border-[#141414] bg-[#e8d8c9] text-[#141414] shadow-[4px_4px_0_#4b607f] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#4b607f] dark:border-[#e8d8c9] dark:bg-[#191919] dark:text-[#e8d8c9] dark:shadow-[4px_4px_0_#4b607f]",
  ghost:
    "text-[#141414] hover:bg-[#141414]/10 dark:text-[#e8d8c9] dark:hover:bg-[#e8d8c9]/10",
  danger:
    "border-2 border-[#141414] bg-red-600 text-white shadow-[4px_4px_0_#141414]",
};

const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-sm",
};

export function Button({
    children,
    className,
    variant = "primary",
    size = "md",
    loading = false,
    disabled,
    type = "button",
    ...props
}) {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={cn(
                "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition disabled:cursor-not-allowed disabled:opacity-50",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            {children}
        </button>
    );
}
