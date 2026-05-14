import {z} from "zod";



const optionSchema = z.object({
  label: z.string().trim().min(1).max(180),
});

const questionSchema = z.object({
  title: z.string().trim().min(1).max(240),
  isRequired: z.boolean().default(true),
  options: z.array(optionSchema).min(2).max(8),
});

export const createPollSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(180),
    description: z.string().trim().max(1000).optional().nullable(),
    responseMode: z.enum(["anonymous", "authenticated"]).default("anonymous"),
    expiresAt: z.string().datetime().optional().nullable(),
    questions: z.array(questionSchema).min(1).max(20),
  }),
});

export const updatePollSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    title: z.string().trim().min(3).max(180).optional(),
    description: z.string().trim().max(1000).optional().nullable(),
    responseMode: z.enum(["anonymous", "authenticated"]).optional(),
    expiresAt: z.string().datetime().optional().nullable(),
  }),
});

export const pollIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const publicPollSchema = z.object({
  params: z.object({
    slug: z.string().trim().min(1).max(160),
  }),
});
