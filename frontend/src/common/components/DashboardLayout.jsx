import { BarChart3, LogOut, Vote } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { Button } from "../components/Button";
import { BrandLogo } from "../components/BrandLogo";
import { ThemeToggle } from "../components/ThemeToggle";
import { clearAccessToken } from "../utils/auth-token";

const navItems = [
    {
        label: "Polls",
        to: "/dashboard/polls",
        icon: Vote,
    },
    {
        label: "Analytics",
        to: "/dashboard/analytics",
        icon: BarChart3,
    },
];

export function DashboardLayout({ theme, onToggleTheme }) {
    const navigate = useNavigate();

    function handleLogout() {
        clearAccessToken();
        navigate("/login");
    }

    return (
        <main className="pollkar-canvas pollkar-grid min-h-screen text-[#141414] dark:text-[#e8d8c9]">
            <header className="sticky top-0 z-20 border-b-2 border-[#141414] bg-[#e8d8c9]/90 backdrop-blur dark:border-[#e8d8c9] dark:bg-[#111111]/90">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                    <NavLink to="/dashboard/polls" className="flex items-center gap-2">
                        <BrandLogo compact />
                        <span className="font-display text-lg font-black tracking-tight">
                            Poll<span className="text-[#f3701e]">Kar</span>
                        </span>
                    </NavLink>

                    <div className="flex items-center gap-2">
                        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
                        <Button variant="ghost" size="sm" onClick={handleLogout}>
                            <LogOut className="size-4" />
                        </Button>
                    </div>
                </div>
            </header>

            <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[240px_1fr]">
                <aside className="hidden md:block">
                    <nav className="sticky top-24 grid gap-2 rounded-[1.35rem] border-2 border-[#141414] bg-[#4b607f] p-3 shadow-[6px_6px_0_#141414] dark:border-[#e8d8c9] dark:bg-[#191919] dark:shadow-[6px_6px_0_#4b607f]">
                        {navItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={({ isActive }) =>
                                        [
                                            "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition",
                                            isActive
                                                ? "bg-[#f3701e] text-[#141414]"
                                                : "text-white hover:bg-white/15 dark:text-[#e8d8c9] dark:hover:bg-[#e8d8c9]/10",
                                        ].join(" ")
                                    }
                                >
                                    <Icon className="size-4" />
                                    {item.label}
                                </NavLink>
                            );
                        })}
                    </nav>
                </aside>

                <section>
                    <Outlet />
                </section>
            </div>
        </main>
    );
}
