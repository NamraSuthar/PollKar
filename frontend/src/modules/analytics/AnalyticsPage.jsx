import { Badge } from "../../common/components/Badge";
import { Card } from "../../common/components/Card";

export function AnalyticsPage() {
    return (
        <div>
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        Live response summaries and question-wise option counts.
                    </p>
                </div>
                <Badge variant="live">Live</Badge>
            </div>

            <Card className="p-6">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Analytics dashboard placeholder.
                </p>
            </Card>
        </div>
    );
}
