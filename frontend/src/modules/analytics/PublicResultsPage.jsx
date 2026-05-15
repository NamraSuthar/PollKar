import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Badge } from "../../common/components/Badge";
import { Button } from "../../common/components/Button";
import { Card } from "../../common/components/Card";
import { api } from "../../common/utils/api";

export function PublicResultsPage() {
    const { slug } = useParams();

    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadResults() {
        setLoading(true);
        setError("");

        try {
            const response = await api.get(`/analytics/public/${slug}`);
            setAnalytics(response.data.data.analytics);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to load results.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadResults();
    }, [slug]);

    if (loading) {
        return (
            <main className="min-h-screen bg-neutral-50 px-4 py-10 text-neutral-950 dark:bg-neutral-950 dark:text-white">
                <div className="mx-auto max-w-3xl">
                    <Card className="p-6">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Loading results...
                        </p>
                    </Card>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-neutral-50 px-4 py-10 text-neutral-950 dark:bg-neutral-950 dark:text-white">
                <div className="mx-auto max-w-3xl">
                    <Card className="p-6">
                        <p className="text-sm text-red-600">{error}</p>
                    </Card>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-neutral-50 px-4 py-10 text-neutral-950 dark:bg-neutral-950 dark:text-white">
            <div className="mx-auto max-w-3xl">
                <Link to={`/poll/${slug}`}>
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="size-4" />
                        Back
                    </Button>
                </Link>

                <div className="mt-6 mb-6">
                    <Badge>Published results</Badge>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight">
                        {analytics.poll.title}
                    </h1>
                    <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                        {analytics.summary.totalResponses} responses collected
                    </p>
                </div>

                <div className="grid gap-4">
                    {analytics.questions.map((question) => (
                        <Card key={question.id} className="p-5">
                            <h2 className="font-semibold">{question.title}</h2>

                            <div className="mt-4 grid gap-3">
                                {question.options.map((option) => (
                                    <div key={option.id}>
                                        <div className="mb-1 flex justify-between gap-4 text-sm">
                                            <span>{option.label}</span>
                                            <span className="text-neutral-500 dark:text-neutral-400">
                                                {option.count} votes · {option.percentage}%
                                            </span>
                                        </div>

                                        <div className="h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-900">
                                            <div
                                                className="h-full rounded-full bg-neutral-950 dark:bg-white"
                                                style={{ width: `${option.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    );
}
