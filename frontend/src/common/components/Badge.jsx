import { cn } from "../utils/cn";

const variants = {
    neutral:
        "border-[#141414] bg-[#e8d8c9] text-[#141414] dark:border-[#e8d8c9] dark:bg-[#191919] dark:text-[#e8d8c9]",
    live:
        "border-[#141414] bg-[#f3701e] text-[#141414] dark:border-[#e8d8c9] dark:bg-[#f3701e] dark:text-[#111111]",
    warning:
        "border-[#141414] bg-[#4b607f] text-white dark:border-[#e8d8c9] dark:bg-[#4b607f] dark:text-[#e8d8c9]",
    danger:
        "border-[#141414] bg-red-600 text-white dark:border-[#e8d8c9] dark:bg-red-700 dark:text-white",
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
