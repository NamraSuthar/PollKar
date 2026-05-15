import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../../common/components/Button";
import { Card } from "../../common/components/Card";
import { Input } from "../../common/components/Input";
import { Select } from "../../common/components/Select";
import { Textarea } from "../../common/components/Textarea";
import { api } from "../../common/utils/api";

function createQuestion() {
    return {
        title: "",
        isRequired: true,
        options: [{ label: "" }, { label: "" }],
    };
}

function toIsoOrNull(localDateTime) {
    if (!localDateTime) {
        return null;
    }

    return new Date(localDateTime).toISOString();
}

export function CreatePollPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        responseMode: "anonymous",
        expiresAt: "",
        questions: [createQuestion()],
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function updateField(field, value) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    function updateQuestion(questionIndex, field, value) {
        setForm((current) => ({
            ...current,
            questions: current.questions.map((question, index) =>
                index === questionIndex ? { ...question, [field]: value } : question
            ),
        }));
    }

    function updateOption(questionIndex, optionIndex, value) {
        setForm((current) => ({
            ...current,
            questions: current.questions.map((question, qIndex) => {
                if (qIndex !== questionIndex) {
                    return question;
                }

                return {
                    ...question,
                    options: question.options.map((option, oIndex) =>
                        oIndex === optionIndex ? { ...option, label: value } : option
                    ),
                };
            }),
        }));
    }

    function addQuestion() {
        setForm((current) => ({
            ...current,
            questions: [...current.questions, createQuestion()],
        }));
    }

    function removeQuestion(questionIndex) {
        setForm((current) => {
            if (current.questions.length === 1) {
                return current;
            }

            return {
                ...current,
                questions: current.questions.filter((_, index) => index !== questionIndex),
            };
        });
    }

    function addOption(questionIndex) {
        setForm((current) => ({
            ...current,
            questions: current.questions.map((question, index) => {
                if (index !== questionIndex || question.options.length >= 8) {
                    return question;
                }

                return {
                    ...question,
                    options: [...question.options, { label: "" }],
                };
            }),
        }));
    }

    function removeOption(questionIndex, optionIndex) {
        setForm((current) => ({
            ...current,
            questions: current.questions.map((question, qIndex) => {
                if (qIndex !== questionIndex || question.options.length <= 2) {
                    return question;
                }

                return {
                    ...question,
                    options: question.options.filter((_, oIndex) => oIndex !== optionIndex),
                };
            }),
        }));
    }

    function validateForm() {
        if (form.title.trim().length < 3) {
            return "Poll title must be at least 3 characters.";
        }

        for (const [questionIndex, question] of form.questions.entries()) {
            if (!question.title.trim()) {
                return `Question ${questionIndex + 1} needs a title.`;
            }

            const filledOptions = question.options.filter((option) =>
                option.label.trim()
            );

            if (filledOptions.length < 2) {
                return `Question ${questionIndex + 1} needs at least two options.`;
            }
        }

        return "";
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");
        setLoading(true);

        const payload = {
            title: form.title.trim(),
            description: form.description.trim() || null,
            responseMode: form.responseMode,
            expiresAt: toIsoOrNull(form.expiresAt),
            questions: form.questions.map((question) => ({
                title: question.title.trim(),
                isRequired: question.isRequired,
                options: question.options
                    .filter((option) => option.label.trim())
                    .map((option) => ({
                        label: option.label.trim(),
                    })),
            })),
        };

        try {
            const response = await api.post("/polls", payload);
            const poll = response.data.data.poll;

            navigate(`/dashboard/polls/${poll.id}`);
        } catch (err) {
            setError(
                err.response?.data?.message || "Unable to create poll. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                    <h1 className="font-display text-3xl font-bold tracking-tight">Create poll</h1>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        Build a single-choice poll with questions, options, expiry, and response mode.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-6">
                <Card className="p-6">
                    <div className="grid gap-5">
                        <Input
                            label="Poll title"
                            placeholder="Team Retro Q2"
                            value={form.title}
                            onChange={(event) => updateField("title", event.target.value)}
                        />

                        <Textarea
                            label="Description"
                            placeholder="What should respondents know before answering?"
                            value={form.description}
                            onChange={(event) =>
                                updateField("description", event.target.value)
                            }
                        />

                        <div className="grid gap-5 md:grid-cols-2">
                            <Select
                                label="Response mode"
                                value={form.responseMode}
                                onChange={(event) =>
                                    updateField("responseMode", event.target.value)
                                }
                            >
                                <option value="anonymous">Anonymous responses</option>
                                <option value="authenticated">Authenticated responses</option>
                            </Select>

                            <Input
                                label="Expiry"
                                type="datetime-local"
                                value={form.expiresAt}
                                onChange={(event) => updateField("expiresAt", event.target.value)}
                            />
                        </div>
                    </div>
                </Card>

                <div className="grid gap-4">
                    {form.questions.map((question, questionIndex) => (
                        <Card key={questionIndex} className="p-6">
                            <div className="mb-5 flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                        Question {questionIndex + 1}
                                    </p>
                                    <h2 className="mt-1 font-semibold">Single choice</h2>
                                </div>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeQuestion(questionIndex)}
                                    disabled={form.questions.length === 1}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>

                            <div className="grid gap-4">
                                <Input
                                    label="Question title"
                                    placeholder="How was the sprint?"
                                    value={question.title}
                                    onChange={(event) =>
                                        updateQuestion(questionIndex, "title", event.target.value)
                                    }
                                />

                                <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                                    <input
                                        type="checkbox"
                                        checked={question.isRequired}
                                        onChange={(event) =>
                                            updateQuestion(
                                                questionIndex,
                                                "isRequired",
                                                event.target.checked
                                            )
                                        }
                                    />
                                    Required question
                                </label>

                                <div className="grid gap-3">
                                    {question.options.map((option, optionIndex) => (
                                        <div
                                            key={optionIndex}
                                            className="grid gap-2 md:grid-cols-[1fr_auto]"
                                        >
                                            <Input
                                                label={`Option ${optionIndex + 1}`}
                                                placeholder="Great"
                                                value={option.label}
                                                onChange={(event) =>
                                                    updateOption(
                                                        questionIndex,
                                                        optionIndex,
                                                        event.target.value
                                                    )
                                                }
                                            />

                                            <div className="flex items-end">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="md"
                                                    onClick={() =>
                                                        removeOption(questionIndex, optionIndex)
                                                    }
                                                    disabled={question.options.length <= 2}
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => addOption(questionIndex)}
                                    disabled={question.options.length >= 8}
                                >
                                    <Plus className="size-4" />
                                    Add option
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>

                {error ? <p className="text-sm text-red-600">{error}</p> : null}

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <Button type="button" variant="secondary" onClick={addQuestion}>
                        <Plus className="size-4" />
                        Add question
                    </Button>

                    <Button type="submit" loading={loading}>
                        Create poll
                    </Button>
                </div>
            </form>
        </div>
    );
}
