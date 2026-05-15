import { Outlet } from "react-router-dom";

export function AuthLayout() {
    return (
        <main className="pulsekar-canvas pulsekar-grid min-h-screen px-4 py-10 text-[#141414] dark:text-[#e8d8c9]">
            <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center">
                <Outlet />
            </div>
        </main>
    );
}
