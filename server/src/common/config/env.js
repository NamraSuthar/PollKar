import dotenv from "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(5000),
  CLIENT_URL: z.string().url().default("http://localhost:5173"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DATABASE_SSL: z
    .string()
    .optional()
    .transform((val) => {
      if (typeof val === "string") {
        const v = val.toLowerCase().trim();
        return v === "1" || v === "true" || v === "yes";
      }
      return false;
    }),
  JWT_ACCESS_SECRET: z
    .string()
    .min(20, "JWT_ACCESS_SECRET must be at least 20 characters"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("1d"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "Invalid environment variables",
    parsedEnv.error.flatten().fieldErrors
  );
  process.exit(1);
}

export const env = {
  nodeEnv: parsedEnv.data.NODE_ENV,
  port: parsedEnv.data.PORT,
  clientUrl: parsedEnv.data.CLIENT_URL,
  databaseUrl: parsedEnv.data.DATABASE_URL,
  databaseSsl: parsedEnv.data.DATABASE_SSL || false,
  jwtAccessSecret: parsedEnv.data.JWT_ACCESS_SECRET,
  jwtAccessExpiresIn: parsedEnv.data.JWT_ACCESS_EXPIRES_IN,
};
