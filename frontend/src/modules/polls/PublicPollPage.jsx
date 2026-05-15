import { BarChart3, CheckCircle2, Lock, Send } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Badge } from "../../common/components/Badge";
import { BrandLogo } from "../../common/components/BrandLogo";
import { Button } from "../../common/components/Button";
import { Card } from "../../common/components/Card";
import { api } from "../../common/utils/api";
import { getAccessToken } from "../../common/utils/auth-token";
import { getOrCreateSessionToken } from "../../common/utils/session-token";

function formatDate(value) {
  if (!value) {
    return "No expiry";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function PublicPollPage() {
  const { slug } = useParams();

  const [poll, setPoll] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const requiredQuestionIds = useMemo(() => {
    if (!poll) {
      return [];
    }

    return poll.questions
      .filter((question) => question.isRequired)
      .map((question) => question.id);
  }, [poll]);

  async function loadPoll() {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(`/polls/public/${slug}`);
      setPoll(response.data.data.poll);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load poll.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPoll();
  }, [slug]);

  function selectOption(questionId, optionId) {
    setAnswers((current) => ({
      ...current,
      [questionId]: optionId,
    }));
  }

  function validateAnswers() {
    for (const questionId of requiredQuestionIds) {
      if (!answers[questionId]) {
        return "Please answer all required questions.";
      }
    }

    return "";
  }

  async function submitResponse(event) {
    event.preventDefault();

    const validationError = validateAnswers();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (poll.responseMode === "authenticated" && !getAccessToken()) {
      setError("Please sign in to respond to this poll.");
      return;
    }

    setSubmitting(true);
    setError("");

    const payload = {
      sessionToken:
        poll.responseMode === "anonymous" ? getOrCreateSessionToken() : null,
      answers: Object.entries(answers).map(([questionId, optionId]) => ({
        questionId,
        optionId,
      })),
    };

    try {
      await api.post(`/responses/polls/${slug}`, payload);
      setSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to submit response. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="pollkar-canvas pollkar-grid min-h-screen px-4 py-10 text-[#141414] dark:text-[#e8d8c9]">
        <div className="mx-auto max-w-2xl">
          <Card className="p-6">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Loading poll...
            </p>
          </Card>
        </div>
      </main>
    );
  }

  if (error && !poll) {
    return (
      <main className="pollkar-canvas pollkar-grid min-h-screen px-4 py-10 text-[#141414] dark:text-[#e8d8c9]">
        <div className="mx-auto max-w-2xl">
          <Card className="p-6">
            <p className="text-sm text-red-600">{error}</p>
          </Card>
        </div>
      </main>
    );
  }

  if (!poll) {
    return (
      <main className="pollkar-canvas pollkar-grid min-h-screen px-4 py-10 text-[#141414] dark:text-[#e8d8c9]">
        <div className="mx-auto max-w-2xl">
          <Card className="p-6">
            <p className="text-sm text-red-600">Poll not found.</p>
          </Card>
        </div>
      </main>
    );
  }

  if (!poll.isPublished) {
    return (
      <main className="pollkar-canvas pollkar-grid min-h-screen px-4 py-10 text-[#141414] dark:text-[#e8d8c9]">
        <div className="mx-auto max-w-2xl">
          <Card className="p-6">
            <Badge variant="warning">Not Published</Badge>
            <h1 className="font-display mt-4 text-4xl font-bold tracking-tight">
              {poll.title}
            </h1>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              This poll is not yet published. Please try again later.
            </p>
          </Card>
        </div>
      </main>
    );
  }

  if (poll.canViewResults) {
    return (
      <main className="pollkar-canvas pollkar-grid min-h-screen px-4 py-10 text-[#141414] dark:text-[#e8d8c9]">
        <div className="mx-auto max-w-2xl">
          <Card className="p-6">
            <Badge>Published results</Badge>
            <h1 className="font-display mt-4 text-4xl font-bold tracking-tight">
              {poll.title}
            </h1>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              Final results are available for this poll.
            </p>
            <Link to={`/poll/${slug}/results`}>
              <Button className="mt-6">
                <BarChart3 className="size-4" />
                View results
              </Button>
            </Link>
          </Card>
        </div>
      </main>
    );
  }

  if (!poll.canRespond) {
    return (
      <main className="pollkar-canvas pollkar-grid min-h-screen px-4 py-10 text-[#141414] dark:text-[#e8d8c9]">
        <div className="mx-auto max-w-2xl">
          <Card className="p-6">
            <Badge variant="warning">Closed</Badge>
            <h1 className="font-display mt-4 text-4xl font-bold tracking-tight">
              {poll.title}
            </h1>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              This poll is no longer accepting responses.
            </p>
          </Card>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="pollkar-canvas pollkar-grid min-h-screen px-4 py-10 text-[#141414] dark:text-[#e8d8c9]">
        <div className="mx-auto max-w-2xl">
          <Card className="p-6 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-full border-2 border-[#141414] bg-[#f3701e] text-[#141414] dark:border-[#e8d8c9]">
              <CheckCircle2 className="size-6" />
            </div>
            <h1 className="font-display mt-4 text-3xl font-bold tracking-tight">
              Response submitted
            </h1>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Thanks for sharing your feedback.
            </p>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="pollkar-canvas pollkar-grid min-h-screen px-4 py-10 text-[#141414] dark:text-[#e8d8c9]">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <BrandLogo compact className="mb-4" />
          <h1 className="font-display mt-2 text-5xl font-bold tracking-tight">
            {poll.title}
          </h1>
          {poll.description ? (
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              {poll.description}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="live">Collecting</Badge>
            <Badge>{poll.responseMode}</Badge>
            <Badge>Expires: {formatDate(poll.expiresAt)}</Badge>
          </div>
        </div>

        {poll.responseMode === "authenticated" && !getAccessToken() ? (
          <Card className="mb-4 p-4">
            <div className="flex items-start gap-3">
              <Lock className="mt-0.5 size-4 text-neutral-500" />
              <div>
                <p className="text-sm font-medium">Sign in required</p>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  This poll only accepts authenticated responses.
                </p>
                <Link to="/login">
                  <Button className="mt-3" size="sm">
                    Sign in
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ) : null}

        <form onSubmit={submitResponse} className="grid gap-4">
          {poll.questions.map((question) => (
            <Card key={question.id} className="p-5">
              <div className="mb-4 flex items-start justify-between gap-4">
                <h2 className="font-semibold">{question.title}</h2>
                <Badge variant={question.isRequired ? "neutral" : "warning"}>
                  {question.isRequired ? "Required" : "Optional"}
                </Badge>
              </div>

              <div className="grid gap-2">
                {question.options.map((option) => {
                  const selected = answers[question.id] === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => selectOption(question.id, option.id)}
                      className={[
                        "rounded-lg border px-4 py-3 text-left text-sm transition",
                        selected
                          ? "border-[#141414] bg-[#f3701e] text-[#141414] shadow-[4px_4px_0_#141414] dark:border-[#e8d8c9] dark:shadow-[4px_4px_0_#4b607f]"
                          : "border-[#141414] bg-[#fff7ef] hover:bg-[#e8d8c9] dark:border-[#e8d8c9] dark:bg-[#191919] dark:hover:bg-[#4b607f]/40",
                      ].join(" ")}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </Card>
          ))}

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <Button
            type="submit"
            loading={submitting}
            disabled={poll.responseMode === "authenticated" && !getAccessToken()}
          >
            <Send className="size-4" />
            Submit response
          </Button>
        </form>
      </div>
    </main>
  );
}
