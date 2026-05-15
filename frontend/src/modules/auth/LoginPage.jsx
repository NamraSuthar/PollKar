import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../../common/components/Button";
import { Card } from "../../common/components/Card";
import { Input } from "../../common/components/Input";
import { api } from "../../common/utils/api";
import { setAccessToken } from "../../common/utils/auth-token";

export function LoginPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function updateField(field, value) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", form);
            const token = response.data.data.accessToken;

            setAccessToken(token);
            navigate("/dashboard/polls");
        } catch (err) {
            setError(
                err.response?.data?.message || "Unable to sign in. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="w-full p-6">
            <div className="mb-8">
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    PulseKar
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                    Welcome back
                </h1>
            </div>

            <form className="grid gap-4" onSubmit={handleSubmit}>
                <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    required
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={form.password}
                    onChange={(event) => updateField("password", event.target.value)}
                    required
                />

                {error ? <p className="text-sm text-red-600">{error}</p> : null}

                <Button type="submit" className="mt-2" loading={loading}>
                    Sign in
                </Button>
            </form>

            <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">
                New here?{" "}
                <Link className="font-medium text-neutral-950 dark:text-white" to="/register">
                    Create account
                </Link>
            </p>
        </Card>
    );
}
