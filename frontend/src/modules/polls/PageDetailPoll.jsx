import { Link, useParams } from "react-router-dom";

import { Button } from "../../common/components/Button";
import { Card } from "../../common/components/Card";

export function PollDetailPage() {
    const { id } = useParams();

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Poll created</h1>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    Poll ID: {id}
                </p>
            </div>

            <Card className="p-6">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Next phase will turn this into the poll details and sharing page.
                </p>

                <Link to="/dashboard/polls">
                    <Button className="mt-5">Back to polls</Button>
                </Link>
            </Card>
        </div>
    );
}
