import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default function Page() {
  return (
    <>
      <SiteNav />
      <header className="pagehead">
        <div className="eyebrow">LEGAL</div>
        <h1>Privacy notice.</h1>
      </header>
      <main className="content">
        <div className="notice">Draft template. Obtain qualified legal review and replace placeholders before collecting personal information or operating a live public service.</div>
        <h2>Information and purpose</h2>
        <p>Monarchis Financial may process personal information for account administration, onboarding verification, service delivery, support handling and legal or regulatory obligations. Personal data is processed only for clearly defined and legitimate purposes.</p>
        <h2>Your rights</h2>
        <p>Individuals may request access, corrections, restrictions or deletion of their personal information where applicable law permits. Contact the organisation’s privacy contact after legal review and registration of the final operating entity.</p>
      </main>
      <SiteFooter />
    </>
  );
}