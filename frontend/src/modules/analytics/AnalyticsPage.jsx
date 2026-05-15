import { Activity, ArrowLeft, BarChart3, Radio } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Badge } from "../../common/components/Badge";
import { Button } from "../../common/components/Button";
import { Card } from "../../common/components/Card";
import { api } from "../../common/utils/api.js";
import { socket } from "../../socket/socket.js";

function formatDate(value) {
  if (!value) {
    return "No expiry";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function OptionBar({ option }) {
  return (
    <div>
      <div className="mb-1 flex justify-between gap-4 text-sm">
        <span>{option.label}</span>
        <span className="text-neutral-500 dark:text-neutral-400">
          {option.count} votes · {option.percentage}%
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full border border-[#141414] bg-[#e8d8c9] dark:border-[#e8d8c9] dark:bg-[#111111]">
        <div
          className="h-full rounded-full bg-[#f3701e] transition-all"
          style={{ width: `${option.percentage}%` }}
        />
      </div>
    </div>
  );
}

export function AnalyticsPage() {
  const { pollId } = useParams();
  const navigate = useNavigate();

  const [polls, setPolls] = useState([]);
  const [selectedPollId, setSelectedPollId] = useState(pollId || null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pollsLoading, setPollsLoading] = useState(true);
  const [error, setError] = useState("");
  const [liveMessage, setLiveMessage] = useState("");

  async function loadPolls() {
    setPollsLoading(true);
    try {
      const response = await api.get("/polls");
      setPolls(response.data.data.polls || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load polls.");
    } finally {
      setPollsLoading(false);
    }
  }

  async function loadAnalytics() {
    if (!selectedPollId) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.get(`/analytics/polls/${selectedPollId}`);
      setAnalytics(response.data.data.analytics);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load analytics.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPolls();
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [selectedPollId]);

  useEffect(() => {
    if (!selectedPollId) {
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("poll:join", selectedPollId);

    function handleResponseCreated(payload) {
      setLiveMessage(`New response received. Total responses: ${payload.responseCount}`);
      loadAnalytics();
    }

    socket.on("poll:response-created", handleResponseCreated);

    return () => {
      socket.emit("poll:leave", selectedPollId);
      socket.off("poll:response-created", handleResponseCreated);
    };
  }, [selectedPollId]);

  if (pollsLoading) {
    return (
      <Card className="p-6">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Loading polls...
        </p>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold tracking-tight">Analytics</h1>
        <Button
          variant="secondary"
          className="mb-4"
          onClick={() => navigate("/dashboard/analytics")}
        >
          <ArrowLeft className="size-4" />
          Back to Analytics
        </Button>
      </div>

      <div>
        {error && !analytics ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : analytics ? (
            <div>
              <Card className="mb-6 border-2 border-[#f3701e] bg-[#fff7ef] p-5 dark:border-[#f3701e] dark:bg-[#1a0f08]">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        {analytics.poll.title}
                      </h2>
                      <Badge variant="live">Live</Badge>
                    </div>

                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                      {analytics.poll.description || "Response analytics and option summaries."}
                    </p>
                  </div>

                  <Link to={`/dashboard/polls/${analytics.poll.id}`}>
                    <Button variant="secondary">View poll</Button>
                  </Link>
                </div>
              </Card>

              {liveMessage ? (
                <Card className="mb-6 border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950">
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">
                    {liveMessage}
                  </p>
                </Card>
              ) : null}

              {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

              <div className="mb-4 grid gap-4 md:grid-cols-3">
                <Card className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Total responses
                      </p>
                      <p className="font-display mt-2 text-4xl font-bold tracking-tight">
                        {analytics.summary.totalResponses}
                      </p>
                    </div>
                    <Activity className="size-5 text-neutral-400" />
                  </div>
                </Card>

                <Card className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Status
                      </p>
                      <p className="mt-2 text-lg font-semibold capitalize">
                        {analytics.summary.completionStatus}
                      </p>
                    </div>
                    <Radio className="size-5 text-neutral-400" />
                  </div>
                </Card>

                <Card className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Expiry
                      </p>
                      <p className="mt-2 text-sm font-semibold">
                        {formatDate(analytics.poll.expiresAt)}
                      </p>
                    </div>
                    <BarChart3 className="size-5 text-neutral-400" />
                  </div>
                </Card>
              </div>

              <div className="grid gap-4">
                {analytics.questions.map((question) => (
                  <Card key={question.id} className="p-5">
                    <div className="mb-4 flex flex-col justify-between gap-2 md:flex-row md:items-start">
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

                    <div className="grid gap-4">
                      {question.options.map((option) => (
                        <OptionBar key={option.id} option={option} />
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : null}
      </div>
    </div>
  );
}
