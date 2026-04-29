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
  title: "장애인 취업 의사결정 플랫폼",
  description: "AI 기반 장애 친화 기업 평가 및 일자리 추천 서비스"
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
