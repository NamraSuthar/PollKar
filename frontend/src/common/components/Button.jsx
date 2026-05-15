import { Loader2 } from "lucide-react";

import { cn } from "../utils/cn";

const variants = {
    primary:
        "bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200",
    secondary:
        "border border-neutral-200 bg-white text-neutral-950 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-900",
    ghost:
        "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900",
    danger:
        "bg-red-600 text-white hover:bg-red-700",
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
