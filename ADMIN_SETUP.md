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
- **Still can't access**: Check that the user was created successfully in Supabase