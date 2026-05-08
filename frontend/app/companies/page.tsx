import CompanyListSection from "@/components/CompanyListSection";
import SiteHeader from "@/components/SiteHeader";
import { getCompanies } from "@/lib/data";

export default async function CompaniesPage() {
  const companies = await getCompanies();

  return (
    <div className="min-h-screen bg-page">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-8">
        <CompanyListSection companies={companies} />
      </main>
    </div>
  );
}
