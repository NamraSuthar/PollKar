import { cn } from "../utils/cn";

export function Card({ className, children }) {
  return (
    <section
      className={cn(
        "rounded-[1.35rem] border-2 border-neutral-950 bg-white shadow-[6px_6px_0_#111] dark:border-neutral-700 dark:bg-[#181816] dark:shadow-[6px_6px_0_#000]",
        className
      )}
    >
      {children}
    </section>
  );
}
