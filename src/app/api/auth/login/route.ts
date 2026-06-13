import { NextResponse } from "next/server";
import {
  authFieldErrors,
  loginSchema,
  type AuthApiResponse,
} from "@/lib/validations";
import { getPrisma } from "@/lib/prisma";
import { setSessionCookie, verifyPassword } from "@/lib/auth";

function logLoginError(error: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.error("Login error:", error);
  }
}

function loginFailure(error: unknown): AuthApiResponse {
  const message = error instanceof Error ? error.message : typeof error === "string" ? error : "";
  const code =
    typeof error === "object" && error && "code" in error && typeof (error as { code?: unknown }).code === "string"
      ? (error as { code: string }).code
      : undefined;

  if (
    code === "ECONNREFUSED" ||
    /can't reach database|connect econnrefused|connection refused|failed to connect|terminating connection/i.test(message)
  ) {
    return {
      success: false,
      message: "Database connection failed. Check your local PostgreSQL setup.",
    };
  }

  return {
    success: false,
    message: "Something went wrong. Please try again.",
  };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json<AuthApiResponse>(
      {
        success: false,
        message: "Please check the highlighted fields.",
        fieldErrors: authFieldErrors(parsed.error),
      },
      { status: 400 },
    );
  }

  try {
    const user = await getPrisma().user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true, name: true, email: true, passwordHash: true },
    });

    if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
      return NextResponse.json<AuthApiResponse>(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 },
      );
    }

    await setSessionCookie(user.id);
    return NextResponse.json<AuthApiResponse>({
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    logLoginError(error);
    const failure = loginFailure(error);
    return NextResponse.json<AuthApiResponse>(failure, {
      status: failure.message?.startsWith("Database connection failed") ? 503 : 500,
    });
  }
}
