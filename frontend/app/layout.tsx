import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";

import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-sans-kr"
});

export const metadata: Metadata = {
  title: "Choicework — 장애인·청년 맞춤 일자리 비교",
  description:
    "실시간 구인 공공 API와 근무환경 지표로, 내 장애 유형에 맞는 채용을 빠르게 비교합니다.",
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={notoSansKr.variable}>
      <body className={`${notoSansKr.className}`}>{children}</body>
    </html>
  );
}
