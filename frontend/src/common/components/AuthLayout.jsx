import { Outlet } from "react-router-dom";

export function AuthLayout() {
    return (
        <main className="min-h-screen bg-neutral-50 px-4 py-10 text-neutral-950 dark:bg-neutral-950 dark:text-white">
            <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center">
                <Outlet />
            </div>
        </main>
    );
}
