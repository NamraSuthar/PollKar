import { Loader2 } from "lucide-react";

import { cn } from "../utils/cn";

const variants = {
  primary:
    "border-2 border-neutral-950 bg-neutral-950 text-white shadow-[3px_3px_0_#d8f275] hover:-translate-y-0.5 dark:border-white dark:bg-white dark:text-neutral-950 dark:shadow-[3px_3px_0_#ef5b52]",
  secondary:
    "border-2 border-neutral-950 bg-white text-neutral-950 shadow-[3px_3px_0_#111] hover:-translate-y-0.5 dark:border-neutral-700 dark:bg-[#181816] dark:text-white dark:shadow-[3px_3px_0_#000]",
  ghost:
    "text-neutral-700 hover:bg-black/5 dark:text-neutral-300 dark:hover:bg-white/10",
  danger:
    "border-2 border-red-700 bg-red-600 text-white shadow-[3px_3px_0_#111]",
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
                "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
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
