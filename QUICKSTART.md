# Quick Start Guide - Coachly

Get up and running in 15 minutes!

## Prerequisites

- Node.js 18+ installed
- Basic understanding of Next.js

## Step 1: Install Dependencies (2 min)

```bash
cd coachly
npm install
```

## Step 2: Set Up Services (5 min)

### 2.1 Clerk (Authentication)

1. Go to https://clerk.com and create account
2. Create new application
3. Copy keys to `.env.local`:
   - Publishable Key → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Secret Key → `CLERK_SECRET_KEY`

### 2.2 Sanity (CMS)

1. Go to https://sanity.io and create account
2. Create new project (name: "Coachly")
3. Copy to `.env.local`:
   - Project ID → `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - Dataset: `production` → `NEXT_PUBLIC_SANITY_DATASET`
4. Create API token (Editor permissions) → `SANITY_API_TOKEN`

### 2.3 Supabase (Database)

1. Go to https://supabase.com and create account
2. Create new project
3. Copy from Project Settings → API:
   - URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service Role → `SUPABASE_SERVICE_ROLE_KEY`
4. **IMPORTANT**: Go to SQL Editor and run the SQL from `supabase-schema.sql`

### 2.4 Google Gemini (AI)

1. Go to https://makersuite.google.com/app/apikey
2. Create API key
3. Copy to `.env.local` → `GEMINI_API_KEY`

### 2.5 Razorpay (Payments)

1. Go to https://razorpay.com and create account
2. Use TEST MODE for development
3. Go to Settings → API Keys
4. Copy:
   - Key ID → `RAZORPAY_KEY_ID` and `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - Key Secret → `RAZORPAY_KEY_SECRET`

## Step 3: Configure Environment (2 min)

Create `.env.local` (copy from `.env.example`):

```bash
cp .env.example .env.local
```

Fill in all the values from Step 2.

## Step 4: Run Development Server (1 min)

```bash
npm run dev
```

Open http://localhost:3000

## Step 5: Create Initial Content (5 min)

### 5.1 Access Sanity Studio

Go to http://localhost:3000/studio

### 5.2 Create Settings

1. Click "Settings" → Create new document
2. Fill in:
   - Site Title: "Coachly"
   - Coach Name: Your name
   - Contact Email: Your email
   - Membership Price: 999 (or your price in INR)

### 5.3 Create Home Page

1. Click "Home Page" → Create new document
2. Fill in:
   - Hero Title: "Transform Your Life"
   - Hero Subtitle: Your tagline
   - About Title: "About Me"
   - About Content: Brief intro
   - Philosophy Title: "Coaching Philosophy"
   - Philosophy Content: Your approach

### 5.4 Create Blog Posts

1. Click "Blog Post" → Create new
2. Create at least 2 posts:
   - Post 1: Set "Free Content" = true (public)
   - Post 2: Set "Free Content" = false (members only)

### 5.5 Upload Knowledge Documents (Optional)

1. Click "Knowledge Document" → Create new
2. Upload a PDF (coach's materials, techniques, etc.)
3. Later, process it for AI training

## Step 6: Test Locally

### Test Public Pages

- ✅ Visit http://localhost:3000
- ✅ Click "Blog" - see your posts
- ✅ Click "Contact" - test form

### Test Authentication

- ✅ Click "Sign In"
- ✅ Create test account
- ✅ Verify email (if required)

### Test Membership Flow

- ✅ Click "Become a Member"
- ✅ Click "Subscribe Now"
- ✅ Use Razorpay test card: `4111 1111 1111 1111`
- ✅ Should redirect to dashboard

### Test Member Features

- ✅ Access dashboard at `/dashboard`
- ✅ See member-only posts
- ✅ Visit library at `/library`

## Common Issues

### "Sanity project not found"
→ Check `NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env.local`

### "Clerk not configured"
→ Check Clerk keys in `.env.local`

### "Database error"
→ Make sure you ran the SQL schema in Supabase

### "Payment not working"
→ Check Razorpay is in TEST mode and keys are correct

## Next Steps

1. **Customize Design**: Edit colors in `tailwind.config.ts`
2. **Add More Content**: Create more blog posts in Sanity
3. **Process AI Knowledge**: Upload coaching documents for chatbot
4. **Deploy**: Follow `DEPLOYMENT.md` when ready

## Quick Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Access Sanity Studio
# http://localhost:3000/studio
```

## Need Help?

- Check `README.md` for detailed documentation
- Check `DEPLOYMENT.md` for deployment guide
- Check browser console for errors
- Check terminal logs for server errors

## Admin Setup

To make yourself an admin:

1. Sign up on your site
2. Go to Clerk Dashboard → Users
3. Find your user → Metadata → Public
4. Add:
```json
{
  "role": ["admin"]
}
```
5. Save and refresh your site

Now you can access Sanity Studio at `/studio`

---

**That's it! You're ready to develop.** 🚀

For production deployment, see `DEPLOYMENT.md`.
