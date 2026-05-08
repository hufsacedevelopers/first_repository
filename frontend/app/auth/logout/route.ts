import { NextResponse } from "next/server";

import { DEMO_USER_COOKIE } from "@/lib/demo-auth";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.delete(DEMO_USER_COOKIE);
  return response;
}
