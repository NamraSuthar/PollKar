import { Card } from "../../common/components/Card";

export function PublicResultsPage() {
    return (
        <main className="min-h-screen bg-neutral-50 px-4 py-10 text-neutral-950 dark:bg-neutral-950 dark:text-white">
            <div className="mx-auto max-w-3xl">
                <Card className="p-6">
                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                        Published Results
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight">
                        Team Retro Q2
                    </h1>
                </Card>
            </div>
        </main>
    );
}
