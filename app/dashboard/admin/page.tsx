"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type AdminOverview = {
  users: Array<{
    id: string;
    email: string | null;
    name: string | null;
    createdAt: string;
    lastSignInAt: string | null;
  }>;
  pageViews: {
    total: number;
    last24Hours: number;
    last7Days: number;
    recent: Array<{ page_path: string; created_at: string }>;
  };
};

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleString() : "Never";
}

export default function AdminDashboard() {
  const router = useRouter();
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOverview() {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          if (active) setError(sessionError.message);
          return;
        }
        if (!data.session) {
          router.replace("/login");
          return;
        }

        const response = await fetch("/api/admin/overview", {
          headers: { Authorization: `Bearer ${data.session.access_token}` },
          cache: "no-store",
        });
        const result = await response.json();
        if (!response.ok) {
          if (active) setError(result.error || "Could not load admin analytics.");
          return;
        }
        if (active) setOverview(result as AdminOverview);
      } catch {
        if (active) setError("Could not connect to admin analytics. Check your connection and try again.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadOverview();
    return () => {
      active = false;
    };
  }, [router]);

  return (
    <main className="adminPage">
      <header className="adminTop">
        <Link href="/dashboard" className="brand"><span className="brandMark">G</span> GenZ SEO</Link>
        <Link href="/dashboard" className="btn secondary small">← Dashboard</Link>
      </header>
      <section className="adminIntro">
        <div className="eyebrow">OWNER / ANALYTICS</div>
        <h1>Website activity</h1>
        <p>Registered accounts and anonymous page views. Visitor identities are not collected.</p>
      </section>

      {loading && <div className="dashLoading">Loading website activity…</div>}
      {error && <div className="error">{error}</div>}
      {overview && (
        <>
          <section className="adminStats" aria-label="Website totals">
            <article className="adminStat"><span>Registered accounts</span><strong>{overview.users.length}</strong></article>
            <article className="adminStat"><span>All page views</span><strong>{overview.pageViews.total}</strong></article>
            <article className="adminStat"><span>Page views · 24 hours</span><strong>{overview.pageViews.last24Hours}</strong></article>
            <article className="adminStat"><span>Page views · 7 days</span><strong>{overview.pageViews.last7Days}</strong></article>
          </section>

          <section className="adminPanel">
            <h2>Registered accounts</h2>
            <p className="adminNote">Email, display name and sign-in times come from Supabase Auth. Passwords are never shown.</p>
            <div className="adminTableWrap">
              <table className="adminTable">
                <thead><tr><th>Name</th><th>Email</th><th>Registered</th><th>Last sign-in</th></tr></thead>
                <tbody>
                  {overview.users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name || "—"}</td>
                      <td>{user.email || "—"}</td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>{formatDate(user.lastSignInAt)}</td>
                    </tr>
                  ))}
                  {overview.users.length === 0 && <tr><td colSpan={4}>No registered accounts yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>

          <section className="adminPanel">
            <h2>Recent page views</h2>
            <p className="adminNote">These are page loads, not unique people. Only the page path and time are stored.</p>
            <div className="adminTableWrap">
              <table className="adminTable">
                <thead><tr><th>Page</th><th>Viewed</th></tr></thead>
                <tbody>
                  {overview.pageViews.recent.map((view, index) => (
                    <tr key={`${view.created_at}-${index}`}>
                      <td>{view.page_path}</td>
                      <td>{formatDate(view.created_at)}</td>
                    </tr>
                  ))}
                  {overview.pageViews.recent.length === 0 && <tr><td colSpan={2}>No page views recorded yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
      <footer className="adminFooter"><Link href="/privacy">Privacy details</Link></footer>
    </main>
  );
}
