import { cn } from "../utils/cn";

export function Textarea({ label, error, className, ...props }) {
    return (
        <label className="grid gap-2">
            {label ? (
                <span className="text-sm font-bold text-[#141414] dark:text-[#e8d8c9]">
                    {label}
                </span>
            ) : null}

            <textarea
                className={cn(
                    "min-h-28 resize-y rounded-xl border-2 border-[#141414] bg-[#fff7ef] px-3 py-3 text-sm text-[#141414] outline-none transition placeholder:text-[#4b607f]/70 focus:shadow-[3px_3px_0_#f3701e] dark:border-[#e8d8c9] dark:bg-[#111111] dark:text-[#e8d8c9] dark:placeholder:text-[#e8d8c9]/50 dark:focus:shadow-[3px_3px_0_#f3701e]",
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
