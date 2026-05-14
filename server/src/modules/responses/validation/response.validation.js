import { z } from "zod";

export const submitResponseSchema = z.object({
    params: z.object({
        slug: z.string().trim().min(1).max(160),
    }),
    body: z.object({
        sessionToken: z.string().trim().max(255).optional().nullable(),
        answers: z
            .array(
                z.object({
                    questionId: z.string().uuid(),
                    optionId: z.string().uuid(),
                })
            )
            .min(1),
    }),
});
