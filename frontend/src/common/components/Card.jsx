import { cn } from "../utils/cn";

export function Card({ className, children }) {
    return (
        <section
            className={cn(
                "rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950",
                className
            )}
        >
            {children}
        </section>
    );
}
