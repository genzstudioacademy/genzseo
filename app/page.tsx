import Link from "next/link";
export default function Home() {
  return <main className="landing">
    <nav className="top"><div className="brand"><span className="brandMark">G</span> GenZ SEO</div><div className="navlinks"><Link href="/login">Login</Link><Link className="btn small" href="/signup">Get started</Link></div></nav>
    <section className="hero">
      <div className="eyebrow">ONE DASHBOARD. YOUR ONLINE PRESENCE.</div>
      <h1>Your Business.<br/><span>Everywhere Online.</span></h1>
      <p>Bring your business information, local SEO tasks and online growth workflow together in one simple place.</p>
      <div className="actions"><Link className="btn" href="/signup">Create free account</Link><Link className="btn secondary" href="/login">I already have an account</Link></div>
      <div className="heroNote">Start with your business profile. Connect supported platforms as integrations become available.</div>
    </section>
    <section className="featureGrid">
      <article><b>01 / Business profile</b><h3>One source of truth</h3><p>Save your business name, category, contact details, address and website in one place.</p></article>
      <article><b>02 / SEO workspace</b><h3>Organize your growth</h3><p>Keep track of your website and local SEO tasks from your dashboard.</p></article>
      <article><b>03 / Integrations</b><h3>Connect with permission</h3><p>Prepare for supported Google and other platform connections. No false ranking promises.</p></article>
    </section>
    <footer>© {new Date().getFullYear()} GenZ SEO · Built to help businesses grow online. <Link href="/privacy">Privacy</Link></footer>
  </main>;
}
