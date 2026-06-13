"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import {
  loginSchema,
  signupSchema,
  type AuthApiResponse,
  type AuthFieldErrors,
} from "@/lib/validations";
import { AuthCard } from "./auth-card";
import { FormError } from "./form-error";
import { PasswordInput } from "./password-input";
import { SubmitButton } from "./submit-button";
import { TextInput } from "./text-input";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthMode;
};

const copy = {
  login: {
    title: "Welcome back",
    subtitle: "Enter your room and pick up where the session left off.",
    submit: "Enter room",
    loading: "Entering room...",
    switchText: "Need an account?",
    switchAction: "Sign up",
    switchHref: "/signup",
  },
  signup: {
    title: "Create your room",
    subtitle: "Start a private archive for your beats, sessions, samples, and notes.",
    submit: "Create room",
    loading: "Creating room...",
    switchText: "Already have an account?",
    switchAction: "Login",
    switchHref: "/login",
  },
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const content = copy[mode];

  function validate(payload: { name?: string; email: string; password: string }) {
    const parsed = mode === "signup" ? signupSchema.safeParse(payload) : loginSchema.safeParse(payload);

    if (parsed.success) {
      setFieldErrors({});
      return true;
    }

    const errors: AuthFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (
        (field === "name" || field === "email" || field === "password") &&
        !errors[field]
      ) {
        errors[field] = issue.message;
      }
    }

    setFieldErrors(errors);
    return false;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setFormError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    };

    if (!validate(payload)) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "signup"
            ? payload
            : { email: payload.email, password: payload.password },
        ),
      });
      const result = (await response.json().catch(() => ({
        success: false,
        message: "Something went wrong. Please try again.",
      }))) as AuthApiResponse;

      if (!response.ok || !result.success) {
        setFieldErrors(result.fieldErrors || {});
        setFormError(result.message || "Something went wrong. Please try again.");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCard title={content.title} subtitle={content.subtitle}>
      <form noValidate onSubmit={submit} className="mt-8 space-y-5">
        {mode === "signup" ? (
          <TextInput
            label="Name"
            name="name"
            autoComplete="name"
            placeholder="Studio name"
            error={fieldErrors.name}
            disabled={isSubmitting}
          />
        ) : null}
        <TextInput
          label="Email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={fieldErrors.email}
          disabled={isSubmitting}
        />
        <PasswordInput
          label="Password"
          name="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          placeholder={mode === "signup" ? "At least 8 characters" : "Enter your password"}
          error={fieldErrors.password}
          disabled={isSubmitting}
        />

        <FormError message={formError} />

        <SubmitButton isLoading={isSubmitting} loadingText={content.loading}>
          {content.submit}
          <ArrowRight className="size-4" />
        </SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        {content.switchText}{" "}
        <Link
          href={content.switchHref}
          className="font-medium text-neutral-200 underline decoration-neutral-700 underline-offset-4 transition hover:text-white hover:decoration-white"
        >
          {content.switchAction}
        </Link>
      </p>
    </AuthCard>
  );
}
