import { NextResponse } from "next/server";

import { DEMO_USER_COOKIE } from "@/lib/demo-auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const nextValue = formData.get("next");
  const nextPath = typeof nextValue === "string" && nextValue.startsWith("/") ? nextValue : "/";

  const response = NextResponse.redirect(new URL(nextPath, request.url));
  response.cookies.set(DEMO_USER_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
