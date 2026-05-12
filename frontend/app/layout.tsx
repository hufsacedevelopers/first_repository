import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import SiteHeader from "@/components/SiteHeader"; // SiteHeader 임포트 추가
import SiteFooter from "@/components/SiteFooter";
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
    "실시간 구인 공고와 근무환경 지표로, 내 장애 유형에 맞는 채용을 빠르게 비교합니다.",
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

        {/* 👈 기존의 한 줄짜리 footer 코드를 지우고 SiteFooter 로 변경 */}
        <SiteFooter />
      </body>
    </html>
  );
}