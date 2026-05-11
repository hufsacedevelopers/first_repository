import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import SiteHeader from "@/components/SiteHeader"; // SiteHeader 임포트 추가

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
      {/* 배경색(bg-page)과 전체 레이아웃 구성을 body에 바로 적용합니다 */}
      <body className={`${notoSansKr.className} min-h-screen bg-page flex flex-col`}>
        {/* 모든 페이지 상단에 네비게이션 바 고정 */}
        <SiteHeader /> 
        
        {/* 각 페이지의 내용이 들어갈 자리 */}
        <main className="flex-1">
          {children}
        </main>

        {/* 모든 페이지 하단에 푸터 고정 */}
        <footer className="border-t border-slate-200/80 pb-12 pt-10 mt-auto">
          <p className="text-center text-sm text-slate-500">
            ChoiceWork · 공공데이터포털·한국장애인고용공단 정보 연계 · 장애인 취업 의사결정 MVP
          </p>
        </footer>
      </body>
    </html>
  );
}