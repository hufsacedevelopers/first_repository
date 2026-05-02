import Image from "next/image";
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex shrink-0 items-end gap-2.5"
          aria-label="Choicework 홈으로"
        >
          <Image
            src="/choicework.png"
            alt=""
            width={256}
            height={256}
            className="h-12 w-auto shrink-0 object-contain"
            priority
          />
          <Image
            src="/choicework_text.png"
            alt=""
            width={520}
            height={120}
            className="h-9 w-auto max-h-12 shrink-0 object-contain object-bottom md:h-10"
            priority
          />
        </Link>
        <nav className="flex items-center gap-6 text-sm text-slate-600" aria-label="주요 메뉴">
          <Link href="/#companies" className="transition hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
            기업 평가
          </Link>
          <Link href="/recommendations" className="transition hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
            맞춤 일자리
          </Link>
          <Link href="/#support" className="transition hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
            지원금
          </Link>
        </nav>
      </div>
    </header>
  );
}
