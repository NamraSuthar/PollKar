import { Moon, Sun } from "lucide-react";

import { Button } from "./Button";

export function ThemeToggle({ theme, onToggle }) {
    const isDark = theme === "dark";

    return (
        <Button
            variant="secondary"
            size="sm"
            onClick={onToggle}
            aria-label="Toggle theme"
        >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
    );
}
