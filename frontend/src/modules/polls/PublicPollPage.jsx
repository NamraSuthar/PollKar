import { Button } from "../../common/components/Button";
import { Card } from "../../common/components/Card";

export function PublicPollPage() {
    return (
        <main className="min-h-screen bg-neutral-50 px-4 py-10 text-neutral-950 dark:bg-neutral-950 dark:text-white">
            <div className="mx-auto max-w-2xl">
                <Card className="p-6">
                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                        PulseKar Poll
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight">
                        Team Retro Q2
                    </h1>
                    <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                        Public poll form placeholder.
                    </p>
                    <Button className="mt-6">Submit response</Button>
                </Card>
            </div>
        </main>
    );
}
