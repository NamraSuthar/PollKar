import {
    BarChart3,
    CheckCircle2,
    Clipboard,
    ExternalLink,
    Send,
    ArrowLeft,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

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

function formatDate(value) {
    if (!value) {
        return "No expiry";
    }

    return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

export function PollDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [poll, setPoll] = useState(null);
    const [loading, setLoading] = useState(true);
    const [publishing, setPublishing] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const publicUrl = useMemo(() => {
        if (!poll) {
            return "";
        }

        return `${window.location.origin}/poll/${poll.slug}`;
    }, [poll]);

    async function loadPoll() {
        setLoading(true);
        setError("");

        try {
            const response = await api.get(`/polls/${id}`);
            setPoll(response.data.data.poll);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to load poll.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPoll();
    }, [id]);

    async function copyLink() {
        await navigator.clipboard.writeText(publicUrl);
        setMessage("Public link copied.");
    }

    async function publishResults() {
        setPublishing(true);
        setMessage("");
        setError("");

        try {
            const response = await api.patch(`/polls/${id}/publish-results`);
            setPoll(response.data.data.poll);
            setMessage("Results published. Public visitors can now view the outcome.");
        } catch (err) {
            setError(err.response?.data?.message || "Unable to publish results.");
        } finally {
            setPublishing(false);
        }
    }

    if (loading) {
        return (
            <Card className="p-6">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Loading poll...
                </p>
            </Card>
        );
    }

    if (error && !poll) {
        return <p className="text-sm text-red-600">{error}</p>;
    }

    const status = getPollStatus(poll);

    return (
        <div>
            <Button 
                variant="secondary" 
                className="mb-4"
                onClick={() => navigate("/dashboard/polls")}
            >
                <ArrowLeft className="size-4" />
                Back to polls
            </Button>

            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                    <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-3xl font-bold tracking-tight">{poll.title}</h1>
                        <Badge variant={status.variant}>{status.label}</Badge>
                    </div>

                    <p className="mt-2 max-w-2xl text-sm text-neutral-500 dark:text-neutral-400">
                        {poll.description || "No description provided."}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Link to={`/dashboard/analytics/${poll.id}`}>
                        <Button variant="secondary">
                            <BarChart3 className="size-4" />
                            Analytics
                        </Button>
                    </Link>

                    <a href={publicUrl} target="_blank" rel="noreferrer">
                        <Button>
                            <ExternalLink className="size-4" />
                            Public page
                        </Button>
                    </a>
                </div>
            </div>

            {message ? (
                <p className="mb-4 text-sm text-emerald-600">{message}</p>
            ) : null}

            {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

            <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
                <div className="grid gap-4">
                    {poll.questions.map((question) => (
                        <Card key={question.id} className="p-5">
                            <div className="mb-4 flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-medium uppercase text-neutral-500 dark:text-neutral-500">
                                        Question {question.position + 1}
                                    </p>
                                    <h2 className="mt-1 font-semibold">{question.title}</h2>
                                </div>

                                <Badge variant={question.isRequired ? "neutral" : "warning"}>
                                    {question.isRequired ? "Required" : "Optional"}
                                </Badge>
                            </div>

                            <div className="grid gap-2">
                                {question.options.map((option) => (
                                    <div
                                        key={option.id}
                                        className="rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-800"
                                    >
                                        {option.label}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>

                <aside className="grid content-start gap-4">
                    <Card className="p-5">
                        <h2 className="font-semibold">Share link</h2>
            <p className="mt-2 break-all rounded-xl border-2 border-[#141414] bg-[#fff7ef] p-3 text-sm text-[#4b607f] dark:border-[#e8d8c9] dark:bg-[#111111] dark:text-[#e8d8c9]">
                            {publicUrl}
                        </p>

                        <Button variant="secondary" className="mt-4 w-full" onClick={copyLink}>
                            <Clipboard className="size-4" />
                            Copy link
                        </Button>
                    </Card>

                    <Card className="p-5">
                        <h2 className="font-semibold">Poll settings</h2>

                        <div className="mt-4 grid gap-3 text-sm">
                            <div className="flex justify-between gap-4">
                                <span className="text-neutral-500 dark:text-neutral-400">
                                    Response mode
                                </span>
                                <span className="font-medium capitalize">{poll.responseMode}</span>
                            </div>

                            <div className="flex justify-between gap-4">
                                <span className="text-neutral-500 dark:text-neutral-400">
                                    Expiry
                                </span>
                                <span className="text-right font-medium">
                                    {formatDate(poll.expiresAt)}
                                </span>
                            </div>

                            <div className="flex justify-between gap-4">
                                <span className="text-neutral-500 dark:text-neutral-400">
                                    Responses
                                </span>
                                <span className="font-medium">{poll.responseCount}</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5">
                        <h2 className="font-semibold">Publish results</h2>
                        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                            After publishing, this same public link will show final results instead of accepting responses.
                        </p>

                        <Button
                            className="mt-4 w-full"
                            variant={poll.isPublished ? "secondary" : "primary"}
                            disabled={poll.isPublished}
                            loading={publishing}
                            onClick={publishResults}
                        >
                            {poll.isPublished ? (
                                <>
                                    <CheckCircle2 className="size-4" />
                                    Published
                                </>
                            ) : (
                                <>
                                    <Send className="size-4" />
                                    Publish results
                                </>
                            )}
                        </Button>
                    </Card>
                </aside>
            </div>
        </div>
    );
}
