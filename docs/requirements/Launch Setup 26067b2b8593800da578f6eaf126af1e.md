# Launch Setup

Great—let’s get CardCapsule live with Lovable + Supabase, user auth, and a custom domain. Here’s a clean, step-by-step plan and the exact knobs to turn, plus the fix for that SSO error.

# **1) Create/connect the core services**

1. **GitHub**
- Create a repo under your org (or your personal account is fine to start).
- In Lovable: Settings → GitHub → connect the repo you’ll deploy from.
1. **Supabase**
- Create a new Supabase project.
- Copy these from Project Settings → API:
    - **Project URL**
    - **anon public key**
    - **service_role key** (server-only use)

# **2) Enable authentication (and fix your error)**

Your error

```
{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}
```

means you’re calling a provider that isn’t turned on in Supabase Auth.

Do this in Supabase → **Authentication → Providers**:

A) **Email (Magic Link)**

- Toggle **Enabled**. This is the fastest “it just works” option.
- In **Auth → URL Configuration**, add your domains to:
    - **Redirect URLs** and **Site URL**
        
        Include all that apply:
        
    - https://<your-lovable-preview-domain>
    - https://<your-custom-domain>
    - http://localhost:3000 (if you ever run local)

B) **Google**

- In Google Cloud → OAuth consent + Credentials → create **Web application** client.
- Add **Authorized redirect URIs** (exactly):
    - https://<your-lovable-preview-domain>/auth/v1/callback
    - https://<your-custom-domain>/auth/v1/callback
    - http://localhost:3000/auth/v1/callback
- Paste the **Client ID** and **Client secret** into Supabase → Providers → Google.
- Toggle **Enabled**.

C) **Apple** (optional for V1, it’s more involved)

- You’ll need: **Services ID**, **Key ID**, **Team ID**, and a **.p8 private key** from Apple Developer.
- Set **Return URL** in Apple to https://<your-domain>/auth/v1/callback.
- Enter those values in Supabase → Providers → Apple and toggle **Enabled**.

If you re-try Google/Apple before they’re enabled or before the redirect URLs match exactly, you’ll see that same 400 error.

# **3) Minimum database setup**

Supabase already stores users in auth.users. Create a simple profiles table and turn on row-level security so users only see their data.

```
-- profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "Users can insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id);
```

If CardCapsule stores uploaded images or card scans, also set up **Storage**:

- Storage → Create bucket cards
- Decide: public or signed URLs. For private-by-default, keep it private and deliver with signed URLs.

# **4) Environment variables in Lovable**

In Lovable → Project Settings → Environment (or similar):

```
# Client-side (safe to expose)
NEXT_PUBLIC_SUPABASE_URL=<your supabase project url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>

# Server-side only (if your code needs it)
SUPABASE_SERVICE_ROLE_KEY=<service role key>  # never expose to browser

# Optional if you use NextAuth or similar:
NEXTAUTH_URL=https://<your-domain>
NEXTAUTH_SECRET=<generate-strong-secret>
```

Common gotchas

- The **public** keys must be prefixed with NEXT_PUBLIC_ if your app expects that.
- Your app’s provider name must match what your code calls (e.g., "google", "apple").

# **5) Wire up the auth calls in the app**

Typical Supabase client calls (example):

```
// Google sign-in
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: `${window.location.origin}/auth/callback` }
});

// Email magic link
await supabase.auth.signInWithOtp({ email });
```

Your redirect target must be allowed in Supabase Auth URLs.

# **6) Deploy from Lovable**

- Commit code to GitHub → Lovable will build and deploy from the connected repo.
- Confirm the app loads and that email sign-in works first. Then test Google. Add Apple later if you want.

# **7) Add your custom domain**

- In Lovable → Domains → **Add Domain** (e.g., cardcapsule.com or app.cardcapsule.com).
- Lovable will show the exact DNS records to create. Typically:
    - For www or app subdomain: **CNAME** → the Lovable target host
    - For the root/apex (cardcapsule.com): either an **ALIAS/ANAME** to the target, or A/AAAA records as instructed by Lovable
- Create those records in your DNS provider.
- Back in Lovable, verify the domain and enable HTTPS.

# **8) Recommended launch path (simple and safe)**

1. Enable **Email Magic Link** in Supabase and launch with it first.
2. Add **Google** once the site is reachable at a stable domain.
3. Add **Apple** if you truly need it for day-one.

# **9) Quick troubleshooting checklist**

- 400 “Unsupported provider”: provider not enabled in Supabase or the name mismatches in code.
- OAuth “redirect_uri_mismatch”: your exact callback isn’t listed in Google/Apple and in Supabase Auth URLs.
- 401/403 on data fetch: missing RLS policies or you’re querying with the wrong key (service key in the browser is not allowed).

# **10) Copy-paste starter assets**

.env template:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXTAUTH_URL=https://app.cardcapsule.com
NEXTAUTH_SECRET=<32+ char random>
```

Initial storage policy (private bucket, signed access from server):

- Keep bucket private
- Generate signed URLs server-side when you need to show a file to a user

If you want, I can draft the exact SQL for your cards data model and a minimal file-upload flow next.