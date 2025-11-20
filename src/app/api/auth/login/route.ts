import { NextResponse, type NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators";
import { createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await createSessionToken({
      sub: user.id,
      email: user.email,
      name: user.name,
    });
    const res = NextResponse.json(
      { id: user.id, email: user.email, name: user.name },
      { status: 200 },
    );
    setSessionCookie(res, token);
    return res;
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid payload", details: error.flatten() },
        { status: 400 },
      );
    }
    console.error("Login error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
