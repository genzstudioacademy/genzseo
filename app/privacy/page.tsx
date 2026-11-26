import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="adminPage">
      <header className="adminTop">
        <Link href="/" className="brand"><span className="brandMark">G</span> GenZ SEO</Link>
        <Link href="/" className="btn secondary small">← Home</Link>
      </header>
      <article className="privacyContent">
        <div className="eyebrow">GENZ SEO</div>
        <h1>Privacy information</h1>
        <p>When you create an account, Supabase Auth stores your email, account creation time, and sign-in time. If you add a business profile or save a website draft, those details are stored in Supabase and are restricted to your account.</p>
        <p>For basic site analytics, GenZ SEO records the page path and time of a page view. It does not intentionally collect a visitor&apos;s name, email, IP address, or device details for this analytics view. Page views are aggregate activity and do not identify unique people.</p>
        <p>Only the configured site administrator can view registered account emails and page-view summaries. Passwords are never visible to the administrator.</p>
      </article>
    </main>
  );
}
