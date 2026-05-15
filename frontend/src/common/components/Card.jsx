import { cn } from "../utils/cn";

export function Card({ className, children }) {
  return (
    <section
      className={cn(
        "rounded-[1.35rem] border-2 border-[#141414] bg-[#f4eadf]/95 shadow-[8px_8px_0_#141414] dark:border-[#e8d8c9] dark:bg-[#191919]/95 dark:shadow-[8px_8px_0_#4b607f]",
        className
      )}
    >
      {children}
    </section>
  );
}
