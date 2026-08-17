# Admin Authentication Setup

## 🚨 SUPABASE CONNECTION ISSUE DETECTED

**Error:** `ERR_NAME_NOT_RESOLVED` when connecting to Supabase
**URL:** `https://unesicenmbspwhjvlqws.supabase.co`

This means your Supabase project is not accessible. Here's how to fix it:

### 🔍 Step 1: Test Current Connection

Visit `http://localhost:9094/test-supabase` to test your current Supabase connection.

### 🔧 Step 2: Check Your Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Check if your project `unesicenmbspwhjvlqws` exists
3. If it doesn't exist, you'll need to create a new project

### 🆕 Step 3: Create New Supabase Project (if needed)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name:** DroneLink Admin
   - **Database Password:** Choose a secure password
   - **Region:** Select closest to your location
5. Click "Create new project"
6. Wait for project to be fully initialized (can take a few minutes)

### 🔑 Step 4: Update Environment Variables

Once your new project is ready:

1. In Supabase Dashboard, go to Settings → API
2. Copy the new values:
   - **Project URL**
   - **anon/public key**

3. Update your `.env` file:
   ```
   VITE_SUPABASE_URL=https://your-new-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-new-anon-key
   ```

4. Restart your development server

### 🗄️ Step 5: Set Up Database Tables

Run the SQL from `supabase-setup.sql` in your Supabase SQL Editor:

1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the entire contents of `supabase-setup.sql`
3. Click "Run"

### 👤 Step 6: Create Admin User

**Option A: Via Supabase Dashboard**
1. Go to Authentication → Users
2. Click "Add user"
3. Enter admin email and password
4. Enable "Auto-confirm user"
5. Click "Add user"

**Option B: Via Application**
1. Visit `http://localhost:9094/admin/signup`
2. Create your admin account

### 🔐 Step 7: Configure Authentication

In Supabase Dashboard:
1. Go to Authentication → Settings
2. Ensure these settings:
   - **Site URL:** `http://localhost:9094`
   - **Redirect URLs:** Add `http://localhost:9094/admin`
   - **Enable email confirmations:** OFF (for development)

### ✅ Step 8: Test Login

1. Visit `http://localhost:9094/admin/login`
2. Enter your admin credentials
3. You should be redirected to the admin dashboard

## Troubleshooting

### "Project not found" error
- Your Supabase project may have been deleted
- Create a new project following Step 3

### "Invalid API key" error
- Check your `.env` file has the correct keys
- Make sure you're using the `anon`/`public` key, not the `service_role` key

### "Email not confirmed" error
- Go to Authentication → Settings in Supabase
- Turn off "Enable email confirmations" for development

### Still having issues?
- Check your internet connection
- Try a different browser
- Clear browser cache and cookies
- Check browser developer tools for more detailed errors

## Alternative: Local Development Setup

If you prefer not to use Supabase for development, you can set up a local PostgreSQL database with Supabase CLI, but that's more complex.

---

## Setting up Admin Authentication

To access the admin panel, you need to create an admin user in Supabase. Follow these steps:

### 1. Create Admin User in Supabase

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to your project
3. Go to **Authentication** > **Users**
4. Click **Add user**
5. Enter the admin email and password
6. Make sure **Auto-confirm user** is enabled
7. Click **Add user**

### 2. Alternative: Sign up via the application

You can also create an admin account by temporarily modifying the authentication flow:

1. Temporarily comment out the `ProtectedRoute` wrapper in `App.tsx`
2. Visit `/admin/login`
3. Click "Sign up" (you'll need to add a sign-up form)
4. After creating the account, restore the protection

### 3. Database Setup

Make sure you've run the SQL setup from `supabase-setup.sql` in your Supabase SQL editor.

### 4. Environment Variables

Ensure your `.env` file has the correct Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Login

Once you have an admin user created:
1. Visit `http://localhost:9094/admin/login`
2. Enter your admin email and password
3. You'll be redirected to the admin dashboard

## Alternative: Create Account via Signup

If you prefer to create an account through the application:
1. Visit `http://localhost:9094/admin/signup`
2. Fill in your admin email and password
3. Create the account
4. Then log in at `/admin/login`

## Troubleshooting

- **"Invalid login credentials"**: Make sure the user exists in Supabase Auth
- **"Email not confirmed"**: Enable auto-confirm in Supabase Auth settings
---

## 🛠️ Troubleshooting: Login, Dashboard Access & Image Uploads

> Verified against the live Supabase project on 8/13/2026.

### 1. "Accessing the dashboard directly without logging in" / stale session
Two changes ensure the login page always appears and the dashboard can't be
reached without credentials:

- The Supabase client is configured with `persistSession: false`
  (`src/lib/supabase.ts`), so sessions are **not restored** from `localStorage`
  across page loads. Every time you open `/admin` or `/admin/dashboard` you see
  the **login form** and must sign in.
- Authentication is **server-verified** (`getUser()`), so a stale/unverified
  session is never trusted.

- **Do a hard refresh** (`Ctrl + Shift + R`) and clear site data for `localhost`
  (DevTools → Application → Storage → Clear site data) once, to discard any
  leftover session already stored in the browser.
- After that, `/admin` and `/admin/dashboard` always show the login page.

### 2. Login is not working ("Invalid login credentials" / "Email not confirmed")
The Supabase auth endpoint responds correctly (diagnostics confirmed), so this
is an account configuration issue, not a connection issue.

- The project has **email confirmation enabled** (`mailer_autoconfirm: false`).
  Either:
  - Create/replace the admin user with **Auto-confirm user** enabled
    (Dashboard → Authentication → Users → Add user), **or**
  - Confirm the admin's email, **or** disable email confirmation for development
    (Dashboard → Authentication → Sign In / Providers → Email → "Confirm email").
- Make sure the admin user exists at all (Dashboard → Authentication → Users).

### 3. "new row violates row-level security policy" when adding an image
This comes from the app inserting into the `project_meta` table, whose Row
Level Security policy only allows `auth.role() = 'authenticated'`. If your
session is not genuinely logged in (see #1 and #2), the insert is rejected.

Fix: complete a successful admin login first — then DB writes are permitted.

### 4. Images don't upload to storage
The `images` storage bucket does **not exist** on the project yet
(verified via `GET /storage/v1/bucket` → `[]`). Create it:
- Run `storage-setup.sql` in the Supabase SQL Editor, **or**
- Manually: Dashboard → Storage → New bucket → name `images`, **Public** = ON.
- **Still can't access**: Check that the user was created successfully in Supabase

### 5. "Adding pictures" / "Adding blog" is not working

There are two parts to this, both fixed by **one** SQL script:

**Backend (do this first):** Run the consolidated `complete-setup.sql` file once in
Supabase Dashboard → SQL Editor → **Run**. It is idempotent (safe to re-run) and:
- Creates the missing public **`images` storage bucket** + storage RLS policies so
  admins can upload/delete and the public can view uploaded images.
- Creates (or repairs) the **blog tables** (`authors`, `blog_categories`,
  `blog_tags`, `blog_posts`, `blog_post_tags`, `blog_analytics`) and all their
  **RLS policies** so an authenticated admin can save blog posts.
- Creates the **`project_meta`** table + RLS policies used by the Image Management
  module.

If you already ran the individual setup scripts before, `complete-setup.sql` will
simply fill in whatever is still missing — no harm re-running it.

**Frontend bug (fixed in this repo):** the Image Gallery (`ImageGallery.tsx`) only
listed files from the **root** of the `images` bucket, while uploads were written
into `gallery/` and `uploads/` subfolders — so uploaded pictures never appeared in
the gallery and the Blog's "Select from Gallery" stayed empty. It now **recursively
lists the whole bucket**, so images from any folder appear. Rebuild/deploy the app
to pick up this change.

### 6. Landing page now pulls real data from the database

`complete-setup.sql` now also creates (idempotently) three new tables that the
**static parts** of the homepage read from, so you can manage them with real data:

| Homepage section | Table | Admin screen |
|------------------|-------|--------------|
| "Our Impact Gallery" | `project_meta` (existing) | Images → Save Project Meta |
| "Our Partners" | `partners` | Admin → Partners |
| "What Our Clients Say" | `testimonials` | Admin → Testimonials |
| "Enterprise Drone Intelligence Services" | `services` | Admin → Services |

Team and Portfolio already read from `team_members` and `portfolio_items`.

Each new table ships with **RLS policies**: the public can read *active* rows, and
only authenticated admins can add/edit/delete. `complete-setup.sql` also inserts
starter rows (the original hardcoded services, partners, and the Robert Malongo
testimonial) so the homepage is not empty after setup.

To add/edit content: sign in to the admin dashboard and use the **Testimonials**,
**Services**, and **Partners** screens in the sidebar. To populate the Impact
Gallery, use **Images → Save Project Meta** (title, description, category, and a
gallery image).
