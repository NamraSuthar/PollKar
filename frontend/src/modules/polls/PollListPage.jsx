import { Badge } from "../../common/components/Badge";
import { Card } from "../../common/components/Card";

export function PollListPage() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Polls</h1>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    Manage live polls, response collection, and published outcomes.
                </p>
            </div>

            <Card className="p-6">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="font-semibold">Team Retro Q2</h2>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                            0 responses collected
                        </p>
                    </div>
                    <Badge variant="live">Collecting</Badge>
                </div>
            </Card>
        </div>
    );
}
