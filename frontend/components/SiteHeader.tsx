import { cookies } from "next/headers";

import { DEMO_USER_COOKIE } from "@/lib/demo-auth";

import SiteHeaderClient from "./SiteHeaderClient";

export default async function SiteHeader() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get(DEMO_USER_COOKIE)?.value === "1";

  return <SiteHeaderClient isLoggedIn={isLoggedIn} />;
}
