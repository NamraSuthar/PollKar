import { ExternalLink, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Badge } from "../../common/components/Badge";
import { Button } from "../../common/components/Button";
import { Card } from "../../common/components/Card";
import { api } from "../../common/utils/api";

function getPollStatus(poll) {
    if (poll.isPublished) {
        return { label: "Published", variant: "neutral" };
    }

    if (poll.expiresAt && new Date(poll.expiresAt) <= new Date()) {
        return { label: "Expired", variant: "warning" };
    }

    return { label: "Collecting", variant: "live" };
}

export function PollListPage() {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadPolls() {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/polls");
            setPolls(response.data.data.polls);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to load polls.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPolls();
    }, []);

    return (
        <div>
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Polls</h1>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        Manage live polls, response collection, and published outcomes.
                    </p>
                </div>

                <Link to="/dashboard/polls/new">
                    <Button>
                        <Plus className="size-4" />
                        New poll
                    </Button>
                </Link>
            </div>

            {loading ? (
                <Card className="p-6">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Loading polls...
                    </p>
                </Card>
            ) : null}

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            {!loading && !error && polls.length === 0 ? (
                <Card className="p-8 text-center">
                    <h2 className="font-semibold">No polls yet</h2>
                    <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                        Create your first poll and start collecting responses.
                    </p>
                    <Link to="/dashboard/polls/new">
                        <Button className="mt-5">
                            <Plus className="size-4" />
                            Create poll
                        </Button>
                    </Link>
                </Card>
            ) : null}

            <div className="grid gap-3">
                {polls.map((poll) => {
                    const status = getPollStatus(poll);
                    const publicUrl = `${window.location.origin}/poll/${poll.slug}`;

                    return (
            <Card key={poll.id} className="p-5 transition hover:-translate-y-0.5">
                            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="font-semibold">{poll.title}</h2>
                                        <Badge variant={status.variant}>{status.label}</Badge>
                                    </div>

                                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                                        {poll.responseCount} responses collected
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <a href={publicUrl} target="_blank" rel="noreferrer">
                                        <Button variant="secondary" size="sm">
                                            <ExternalLink className="size-4" />
                                            Public
                                        </Button>
                                    </a>

                                    <Link to={`/dashboard/polls/${poll.id}`}>
                                        <Button size="sm">Open</Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
