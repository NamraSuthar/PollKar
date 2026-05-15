import { Button } from "../../common/components/Button";
import { Card } from "../../common/components/Card";
import { Input } from "../../common/components/Input";
import { Textarea } from "../../common/components/Textarea";

export function CreatePollPage() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Create poll</h1>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    Build a single-choice poll with questions, options, expiry, and response mode.
                </p>
            </div>

            <Card className="p-6">
                <form className="grid gap-5">
                    <Input label="Poll title" placeholder="Team Retro Q2" />
                    <Textarea label="Description" placeholder="What should respondents know?" />
                    <Button type="submit">Create poll</Button>
                </form>
            </Card>
        </div>
    );
}
