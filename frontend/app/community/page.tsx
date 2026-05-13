import { cookies } from "next/headers";
import { DEMO_USER_COOKIE } from "@/lib/demo-auth";
import CommunityClient from "./CommunityClient";

export default async function CommunityPage() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get(DEMO_USER_COOKIE)?.value === "1";
  return <CommunityClient isLoggedIn={isLoggedIn} />;
}
