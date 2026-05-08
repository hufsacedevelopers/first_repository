import CompanyListSection from "@/components/CompanyListSection";
import SiteHeader from "@/components/SiteHeader";
import { getCompaniesWithMeta } from "@/lib/data";

export default async function CompaniesPage() {
  const result = await getCompaniesWithMeta();

  return (
    <div className="min-h-screen bg-page">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-8">
        <CompanyListSection companies={result.companies} source={result.source} syncedAt={result.syncedAt} />
      </main>
    </div>
  );
}
