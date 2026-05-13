import SavedJobsClient from "./SavedJobsClient";

export default function SavedJobsPage() {
  return (
    <div className="min-h-screen bg-page">
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">
          Saved
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">관심 공고</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          브라우저에 저장된 찜 목록입니다. 다른 기기와는 연동되지 않습니다.
        </p>
        <div className="mt-8">
          <SavedJobsClient />
        </div>
      </main>
    </div>
  );
}
