import { cn } from "../utils/cn";

const variants = {
    neutral:
        "border-neutral-200 bg-neutral-50 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300",
    live:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
    warning:
        "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
    danger:
        "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
};

export function Badge({ children, variant = "neutral", className }) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    );
}
