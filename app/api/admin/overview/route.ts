import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const pageSize = 1000;
const maxPages = 100;

function responseError(message: string, status: number) {
  return NextResponse.json({ error: message }, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

export async function GET(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const secretKey =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (!supabaseUrl || !publishableKey || !secretKey || adminEmails.length === 0) {
    return responseError(
      "Admin analytics needs SUPABASE_SECRET_KEY and ADMIN_EMAILS configured on the server, plus the site_pageviews table from supabase/schema.sql.",
      503,
    );
  }

  const token = request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return responseError("Sign in to view admin analytics.", 401);

  const authClient = createClient(supabaseUrl, publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: authData, error: authError } = await authClient.auth.getUser(token);
  if (authError || !authData.user) {
    return responseError("Your session is invalid or expired. Please sign in again.", 401);
  }

  const email = authData.user.email?.toLowerCase();
  if (!email || !adminEmails.includes(email)) {
    return responseError("This account is not allowed to view admin analytics.", 403);
  }

  const adminClient = createClient(supabaseUrl, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const users: Array<{
    id: string;
    email: string | null;
    name: string | null;
    createdAt: string;
    lastSignInAt: string | null;
  }> = [];
  let allUsersLoaded = false;

  for (let page = 1; page <= maxPages; page += 1) {
    const { data, error } = await adminClient.auth.admin.listUsers({
      page,
      perPage: pageSize,
    });

    if (error) {
      console.error("Could not load registered users:", error.message);
      return responseError("Could not load registered accounts. Check the server-side Supabase secret key.", 502);
    }

    users.push(...data.users.map((user) => ({
      id: user.id,
      email: user.email ?? null,
      name:
        (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
        (typeof user.user_metadata?.name === "string" && user.user_metadata.name) ||
        null,
      createdAt: user.created_at,
      lastSignInAt: user.last_sign_in_at ?? null,
    })));

    if (data.users.length < pageSize) {
      allUsersLoaded = true;
      break;
    }
  }

  if (!allUsersLoaded) {
    return responseError("The user list exceeds the supported page limit. Contact the site administrator.", 503);
  }

  const now = Date.now();
  const since24Hours = new Date(now - 24 * 60 * 60 * 1000).toISOString();
  const since7Days = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
  const [allViews, recentViews, weekViews, latestViews] = await Promise.all([
    adminClient.from("site_pageviews").select("id", { count: "exact", head: true }),
    adminClient
      .from("site_pageviews")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since24Hours),
    adminClient
      .from("site_pageviews")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since7Days),
    adminClient
      .from("site_pageviews")
      .select("page_path, created_at")
      .gte("created_at", since7Days)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const pageViewError =
    allViews.error || recentViews.error || weekViews.error || latestViews.error;
  if (pageViewError) {
    console.error("Could not load page-view analytics:", pageViewError.message);
    return responseError("Could not load page views. Run the latest supabase/schema.sql in the Supabase SQL Editor.", 503);
  }

  return NextResponse.json({
    users,
    pageViews: {
      total: allViews.count ?? 0,
      last24Hours: recentViews.count ?? 0,
      last7Days: weekViews.count ?? 0,
      recent: latestViews.data,
    },
  }, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
