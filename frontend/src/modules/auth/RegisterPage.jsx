import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../../common/components/Button";
import { BrandLogo } from "../../common/components/BrandLogo";
import { Card } from "../../common/components/Card";
import { Input } from "../../common/components/Input";
import { api } from "../../common/utils/api";
import { setAccessToken } from "../../common/utils/auth-token";

export function RegisterPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
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
            const response = await api.post("/auth/register", form);
            const token = response.data.data.accessToken;

            setAccessToken(token);
            navigate("/dashboard/polls");
        } catch (err) {
            setError(
                err.response?.data?.message || "Unable to create account. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="w-full p-6">
            <div className="mb-8">
                <BrandLogo className="mb-6" />
                <h1 className="font-display mt-2 text-4xl font-bold tracking-tight">
                    Create account
                </h1>
            </div>

            <form className="grid gap-4" onSubmit={handleSubmit}>
                <Input
                    label="Name"
                    placeholder="name"
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    required
                />

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
                    Create account
                </Button>
            </form>

            <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">
                Already have an account?{" "}
                <Link className="font-bold text-[#f3701e]" to="/login">
                    Sign in
                </Link>
            </p>
        </Card>
    );
}
