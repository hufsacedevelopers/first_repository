import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { DEMO_USER, DEMO_USER_COOKIE } from "@/lib/demo-auth";

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get(DEMO_USER_COOKIE)?.value === "1";
  const params = await searchParams;
  const nextPath = params.next && params.next.startsWith("/") ? params.next : "/";

  if (isLoggedIn) {
    redirect(nextPath);
  }

  return (
    <main className="min-h-screen bg-page px-6 py-10">
      <section className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-2xl font-bold text-slate-900">로그인</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          현재는 MVP 데모 로그인만 제공합니다. 버튼을 누르면{" "}
          <strong className="text-slate-900">{DEMO_USER.name}</strong> 계정으로 바로 입장합니다.
        </p>

        <form action="/auth/demo-login" method="post" className="mt-8">
          <input type="hidden" name="next" value={nextPath} />
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
          >
            데모 사용자로 로그인
          </button>
        </form>

        <Link
          href="/"
          className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          홈으로 돌아가기
        </Link>
      </section>
    </main>
  );
}
