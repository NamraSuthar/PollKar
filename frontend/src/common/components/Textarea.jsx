import { cn } from "../utils/cn";

export function Textarea({ label, error, className, ...props }) {
    return (
        <label className="grid gap-2">
            {label ? (
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    {label}
                </span>
            ) : null}

            <textarea
                className={cn(
                    "min-h-28 resize-y rounded-lg border border-neutral-200 bg-white px-3 py-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:focus:border-white",
                    error &&
                    "border-red-500 focus:border-red-500 dark:border-red-500 dark:focus:border-red-500",
                    className
                )}
                {...props}
            />

            {error ? <span className="text-sm text-red-600">{error}</span> : null}
        </label>
    );
}
