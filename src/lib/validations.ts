import { z } from "zod";

export const fileCategories = [
  "beat",
  "sample",
  "loop",
  "stem",
  "vocal",
  "recording",
  "project",
] as const;

export const allowedExtensions = [
  ".mp3",
  ".wav",
  ".flac",
  ".aac",
  ".m4a",
  ".zip",
  ".flp",
  ".als",
  ".rpp",
] as const;

export const playableExtensions = [".mp3", ".wav", ".flac", ".aac", ".m4a"] as const;

export const authSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().trim().email("Enter a valid email address").toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name."),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email.")
    .email("Please enter a valid email address.")
    .toLowerCase(),
  password: z
    .string()
    .min(1, "Please enter your password.")
    .min(8, "Password must be at least 8 characters."),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email.")
    .email("Please enter a valid email address.")
    .toLowerCase(),
  password: z.string().min(1, "Please enter your password."),
});

export type AuthFieldErrors = {
  name?: string;
  email?: string;
  password?: string;
};

export type AuthApiResponse = {
  success: boolean;
  message?: string;
  fieldErrors?: AuthFieldErrors;
  user?: {
    id: string;
    name: string;
    email: string;
  };
};

export function authFieldErrors(error: z.ZodError): AuthFieldErrors {
  const fieldErrors: AuthFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (
      (field === "name" || field === "email" || field === "password") &&
      !fieldErrors[field]
    ) {
      fieldErrors[field] = issue.message;
    }
  }

  return fieldErrors;
}

export const metadataSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  category: z.enum(fileCategories),
  genre: z.string().trim().max(80).optional().or(z.literal("")),
  mood: z.string().trim().max(80).optional().or(z.literal("")),
  bpm: z.coerce.number().int().min(1).max(400).optional().or(z.literal("")),
  musicalKey: z.string().trim().max(20).optional().or(z.literal("")),
  tags: z.string().trim().max(240).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type MetadataInput = z.infer<typeof metadataSchema>;
