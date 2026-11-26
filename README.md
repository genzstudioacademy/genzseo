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

## 2. Run locally
Install Node.js 20 or newer. In this folder:
```bash
npm install
cp .env.example .env.local
```
Edit `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from Supabase, then:
```bash
npm run dev
```
Open http://localhost:3000

## 3. Publish online
1. Push this project to a private GitHub repository.
2. Import it into Vercel (https://vercel.com/).
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in Vercel project environment variables.
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
