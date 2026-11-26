# GenZ SEO — working MVP starter

This is a real application starter, not a live hosted service. It includes:
- Email/password sign-up and login through Supabase Auth
- Protected dashboard flow
- Per-user business profile create/update
- Supabase Postgres database with Row Level Security (RLS)

SEO scanning, Google Business Profile publishing, directory submissions, review messaging and AI-search integrations are **not connected yet**. Each requires separate API access, platform permissions, and implementation. Never promise Google rankings or AI recommendations.

## 1. Create the backend (Supabase)
1. Create a project at https://supabase.com/
2. In Project Settings → API Keys, copy the Project URL and publishable key.
3. Open SQL Editor and run `supabase/schema.sql`.
4. In Authentication → URL Configuration, allow `http://localhost:3000/dashboard` and `http://127.0.0.1:3000/dashboard` for local testing. For production, add your deployed dashboard URL too.
5. For easier initial testing, you may disable email confirmation in Authentication → Providers → Email. For a public production site, keep email confirmation enabled and configure SMTP.

## Google sign-in
1. In Supabase, open Authentication → Providers → Google and enable Google. Create an OAuth client in Google Cloud and add the callback URL shown by Supabase to the Google client's authorized redirect URIs.
2. Add the Google client ID and client secret to the Supabase Google provider settings.
3. In Supabase Authentication → URL Configuration, set the Site URL and allow the app callback URLs, including `http://localhost:3000/dashboard` and `http://127.0.0.1:3000/dashboard` for local testing and your production dashboard URL.
4. Google sign-in is available on both `/signup` and `/login`. The Google provider must be enabled in Supabase before the buttons can complete sign-in.

## Owner analytics
- The owner-only `/dashboard/admin` page lists registered account names, emails, registration times and last sign-ins, plus aggregate page-view counts.
- Anonymous analytics records only each page path and timestamp; it does not identify visitors. Page views are not unique people.
- Run the full `supabase/schema.sql` in Supabase SQL Editor to create the account data tables and anonymous page-view table.
- Set `NEXT_PUBLIC_ADMIN_EMAIL` for the navigation link, `ADMIN_EMAILS` for the server-side access check, and `SUPABASE_SECRET_KEY` as a server-only environment variable. Never prefix the secret key with `NEXT_PUBLIC_` or commit it.
- The admin page requires the signed-in email to match an address in `ADMIN_EMAILS`. The server validates the session and uses the secret key only in the API route.

## 2. Run locally
Install Node.js 20 or newer. In this folder:
```bash
npm install
cp .env.example .env.local
```
Edit `.env.local` with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_ADMIN_EMAIL` from your setup. Add `ADMIN_EMAILS` and a newly rotated `SUPABASE_SECRET_KEY` locally for the owner analytics page, then:
```bash
npm run dev
```
Open http://localhost:3000

## 3. Publish online
1. Push this project to a private GitHub repository.
2. Import it into Vercel (https://vercel.com/).
3. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_ADMIN_EMAIL`, `ADMIN_EMAILS`, and `SUPABASE_SECRET_KEY` in Vercel project environment variables. Keep `SUPABASE_SECRET_KEY` server-only.
4. Deploy, then add your domain in Vercel and add that domain to Supabase Auth URL Configuration.

## Security notes
- The Supabase anon/publishable key is designed for browser use; never put a Supabase service-role key in frontend code.
- RLS policies restrict each signed-in user to their own business profile.
- Use HTTPS in production. Configure email confirmation and SMTP before opening sign-ups publicly.
- Add rate limiting, abuse protection/CAPTCHA, privacy policy, terms, and backups before a broad public launch.


## AI Website Builder (starter implementation)
- Open `/dashboard/website-builder` after signing in.
- Enter business details, services, tagline and brand colour for a live responsive preview.
- Save a private website draft in Supabase `generated_sites`.
- Export a standalone HTML draft for hosting.
- Run the updated `supabase/schema.sql` in Supabase SQL Editor to create the RLS-protected table.

Important: this is a template-based website draft builder, not yet an external generative-AI integration or one-click hosting service. AI copy/image generation, custom-domain provisioning, publishing automation and Google integrations require API credentials and deployment configuration.
