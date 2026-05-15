import { cn } from "../utils/cn";

export function BrandLogo({ compact = false, className }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Light Mode Logo Icon */}
      <svg
        viewBox="0 0 400 400"
        className={cn(compact ? "size-10" : "size-14", "shrink-0 dark:hidden")}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Outer speech bubble circle */}
        <circle cx="200" cy="150" r="120" fill="none" stroke="#1a1a1a" strokeWidth="30" />
        
        {/* Left tail - curved shape */}
        <path d="M 100 240 Q 80 280 120 320" fill="#1a1a1a" />
        
        {/* Inner bars background */}
        <rect x="140" y="100" width="120" height="100" rx="12" fill="none" stroke="#1a1a1a" strokeWidth="8" />
        
        {/* Bar 1 - Blue */}
        <rect x="155" y="155" width="18" height="35" rx="4" fill="#4B5F7F" />
        {/* Bar 2 - Gray Blue */}
        <rect x="185" y="140" width="18" height="50" rx="4" fill="#5F7A9F" />
        {/* Bar 3 - Orange */}
        <rect x="215" y="120" width="18" height="70" rx="4" fill="#FF6B35" />
      </svg>

      {/* Dark Mode Logo Icon */}
      <svg
        viewBox="0 0 400 400"
        className={cn(compact ? "size-10" : "size-14", "shrink-0 hidden dark:block")}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Outer speech bubble circle */}
        <circle cx="200" cy="150" r="120" fill="none" stroke="#ffffff" strokeWidth="30" />
        
        {/* Left tail - curved shape */}
        <path d="M 100 240 Q 80 280 120 320" fill="#ffffff" />
        
        {/* Inner bars background */}
        <rect x="140" y="100" width="120" height="100" rx="12" fill="none" stroke="#ffffff" strokeWidth="8" />
        
        {/* Bar 1 - Blue */}
        <rect x="155" y="155" width="18" height="35" rx="4" fill="#4B5F7F" />
        {/* Bar 2 - Gray Blue */}
        <rect x="185" y="140" width="18" height="50" rx="4" fill="#5F7A9F" />
        {/* Bar 3 - Orange */}
        <rect x="215" y="120" width="18" height="70" rx="4" fill="#FF6B35" />
      </svg>

      {!compact ? (
        <span className="font-display text-3xl font-black tracking-tight text-[#141414] dark:text-[#f7f2ec]">
          Poll<span className="text-[#f3701e]">Kar</span>
        </span>
      ) : null}
    </div>
  );
}
