import { NextResponse } from "next/server";
import {
  authFieldErrors,
  signupSchema,
  type AuthApiResponse,
} from "@/lib/validations";
import { getPrisma } from "@/lib/prisma";
import { hashPassword, setSessionCookie } from "@/lib/auth";

function logSignupError(error: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.error("Signup error:", error);
  }
}

function errorText(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "";
}

function errorCode(error: unknown) {
  if (typeof error === "object" && error && "code" in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === "string" ? code : undefined;
  }

  return undefined;
}

function signupFailure(error: unknown) {
  const message = errorText(error);
  const code = errorCode(error);

  if (code === "P2002") {
    return {
      status: 409,
      response: {
        success: false,
        message: "This email is already registered.",
        fieldErrors: { email: "This email is already registered." },
      } satisfies AuthApiResponse,
    };
  }

  if (code === "P2021" || code === "P2022" || /does not exist|relation .* does not exist/i.test(message)) {
    return {
      status: 500,
      response: {
        success: false,
        message: "Database is not migrated. Run npm run db:migrate and try again.",
      } satisfies AuthApiResponse,
    };
  }

  if (/database_url|connection string/i.test(message)) {
    return {
      status: 500,
      response: {
        success: false,
        message: "Database is not configured. Set DATABASE_URL and restart the app.",
      } satisfies AuthApiResponse,
    };
  }

  if (
    code === "ECONNREFUSED" ||
    /can't reach database|connect econnrefused|connection refused|failed to connect|terminating connection/i.test(message)
  ) {
    return {
      status: 503,
      response: {
        success: false,
        message: "Database connection failed. Check your local PostgreSQL setup.",
      } satisfies AuthApiResponse,
    };
  }

  return {
    status: 500,
    response: {
      success: false,
      message: "Something went wrong. Please try again.",
    } satisfies AuthApiResponse,
  };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);

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
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is missing");
    }

    const prisma = getPrisma();
    const email = parsed.data.email.toLowerCase();
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json<AuthApiResponse>(
        {
          success: false,
          message: "This email is already registered.",
          fieldErrors: { email: "This email is already registered." },
        },
        { status: 409 },
      );
    }

    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email,
        passwordHash: await hashPassword(parsed.data.password),
      },
      select: { id: true, name: true, email: true },
    });

    try {
      await setSessionCookie(user.id);
    } catch (sessionError) {
      logSignupError(sessionError);
      return NextResponse.json<AuthApiResponse>(
        {
          success: false,
          message: "Account was created, but sign-in session could not be started. Please log in.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json<AuthApiResponse>({ success: true, user });
  } catch (error) {
    logSignupError(error);
    const failure = signupFailure(error);

    return NextResponse.json<AuthApiResponse>(failure.response, {
      status: failure.status,
    });
  }
}
