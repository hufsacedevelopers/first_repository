import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "장애인 취업 의사결정 플랫폼",
  description: "AI 기반 장애 친화 기업 평가 및 일자리 추천 서비스"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
