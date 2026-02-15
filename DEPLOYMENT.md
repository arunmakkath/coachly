# Deployment Guide - Coachly

Complete step-by-step guide to deploy Coachly to production (100% FREE).

## Prerequisites Checklist

Before deploying, ensure you have:

- [ ] GitHub account
- [ ] Vercel account (free)
- [ ] Clerk production app configured
- [ ] Sanity production project configured
- [ ] Supabase production project with pgvector setup
- [ ] Gemini API key
- [ ] Razorpay account (test mode is fine for now)

## Step 1: Prepare for Deployment

### 1.1 Update package.json

Ensure these scripts are present:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 1.2 Test Local Build

```bash
npm run build
npm start
```

Visit http://localhost:3000 and verify everything works.

### 1.3 Create .gitignore

Ensure sensitive files are excluded:

```
node_modules/
.next/
.env
.env.local
.env.production
.vercel/
.DS_Store
```

## Step 2: Push to GitHub

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Coachly coaching platform"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/coachly.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### 3.1 Connect GitHub

1. Go to https://vercel.com
2. Click "Add New Project"
3. Click "Import Git Repository"
4. Select your `coachly` repository
5. Click "Import"

### 3.2 Configure Project

**Framework Preset**: Next.js (auto-detected)

**Build Command**: `npm run build` (default)

**Output Directory**: `.next` (default)

**Install Command**: `npm install` (default)

### 3.3 Add Environment Variables

Click "Environment Variables" and add ALL of these:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_prod_xxxxx
CLERK_SECRET_KEY=sk_prod_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Gemini
GEMINI_API_KEY=your_gemini_api_key

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx

# App
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
NODE_ENV=production
```

**Important**: For each variable:
- Select "Production", "Preview", and "Development"
- Click "Add" for each one

### 3.4 Deploy

Click "Deploy" button. Deployment takes 2-5 minutes.

Once complete, you'll get a URL like: `https://coachly-xxxxx.vercel.app`

## Step 4: Update External Services

### 4.1 Update Clerk

1. Go to Clerk Dashboard → Configure → Paths
2. Update URLs to match your Vercel domain:
   - Sign in URL: `https://your-project.vercel.app/sign-in`
   - Sign up URL: `https://your-project.vercel.app/sign-up`
   - After sign in: `https://your-project.vercel.app/dashboard`

3. Go to Configure → Allowed redirect URLs
4. Add: `https://your-project.vercel.app/*`

### 4.2 Update Sanity CORS

1. Go to Sanity Dashboard → API → CORS Origins
2. Add: `https://your-project.vercel.app`
3. Allow credentials: ✓

### 4.3 Update Razorpay Webhook

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://your-project.vercel.app/api/webhooks/razorpay`
3. Select events: `payment.captured`
4. Set Active: ✓

### 4.4 Update Environment Variable

In Vercel:
1. Go to Project Settings → Environment Variables
2. Find `NEXT_PUBLIC_APP_URL`
3. Update to: `https://your-project.vercel.app`
4. Redeploy (Deployments → ... → Redeploy)

## Step 5: Post-Deployment Setup

### 5.1 Create Admin User

1. Sign up on your live site
2. In Clerk Dashboard, find your user
3. Go to User → Metadata → Public metadata
4. Add:
```json
{
  "role": ["admin"]
}
```
5. Save

### 5.2 Access Sanity Studio

Visit: `https://your-project.vercel.app/studio`

Create initial content:
1. **Settings**: Site title, coach name, membership price
2. **Home**: Hero title, about section, philosophy
3. **Blog Posts**: At least 2 posts (1 free, 1 member-only)
4. **Knowledge Documents**: Upload coach's PDFs

### 5.3 Process Documents

Use Postman or curl to trigger embedding generation:

```bash
curl -X POST https://your-project.vercel.app/api/embeddings/refresh \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN"
```

## Step 6: Testing Checklist

### Public Access
- [ ] Home page loads
- [ ] Free blog posts visible
- [ ] Contact form works
- [ ] About page loads

### Authentication
- [ ] Sign up works
- [ ] Sign in works
- [ ] Email verification works (if enabled)

### Payment Flow
- [ ] Checkout page loads
- [ ] Razorpay modal opens
- [ ] Test payment succeeds (use test card: 4111 1111 1111 1111)
- [ ] Role upgraded to "member"
- [ ] Redirected to dashboard

### Member Area
- [ ] Dashboard accessible
- [ ] Premium posts visible
- [ ] Library page shows documents
- [ ] AI chatbot appears
- [ ] AI chatbot responds correctly

### Mobile Testing
- [ ] All pages responsive on mobile
- [ ] Chat widget works on mobile
- [ ] Payment flow works on mobile

## Step 7: Monitor & Maintain

### Check Logs

In Vercel Dashboard → Deployments → (select deployment) → Function Logs

### View Analytics

Vercel Dashboard → Analytics (shows page views, visitors)

### Update Content

Access Sanity Studio anytime at: `your-domain.vercel.app/studio`

### Redeploy

When you push to GitHub main branch, Vercel auto-deploys.

Manual redeploy:
1. Vercel Dashboard → Deployments
2. Latest deployment → ... → Redeploy

## Optional: Custom Domain

### Purchase Domain

Recommended registrars for India:
- GoDaddy (~₹800/year)
- Namecheap (~₹600/year)
- Google Domains

### Configure in Vercel

1. Vercel Dashboard → Settings → Domains
2. Add your domain (e.g., `coachly.in`)
3. Follow DNS instructions:
   - Add A record: `76.76.21.21`
   - Add CNAME for www: `cname.vercel-dns.com`
4. Wait 24-48 hours for DNS propagation
5. Update all redirect URLs in Clerk, Razorpay, etc.

## Troubleshooting

### Build Fails

Check Vercel build logs for errors. Common issues:
- Missing environment variables
- TypeScript errors
- Missing dependencies

### 500 Errors

Check Function Logs in Vercel. Common causes:
- Invalid API keys
- Database connection issues
- Missing Supabase functions

### Payment Not Working

- Verify Razorpay test mode is enabled
- Check webhook signature verification
- Check Clerk role update in logs

### AI Not Responding

- Verify Gemini API key is valid
- Check Supabase vector function exists
- Verify embeddings were generated

## Scaling Considerations

Your platform will remain FREE until:

1. **Vercel**: >100GB bandwidth/month
2. **Sanity**: >500k API requests/month
3. **Clerk**: >10,000 active users/month
4. **Supabase**: >2GB bandwidth or >500MB storage
5. **Gemini**: >1500 requests/day

When limits approach, consider:
- Vercel Pro: $20/month
- Sanity Growth: $99/month
- Supabase Pro: $25/month

## Security Checklist

- [ ] All API routes check authentication
- [ ] Webhook signatures verified
- [ ] Environment variables never in code
- [ ] CORS configured correctly
- [ ] Rate limiting on API routes (optional)
- [ ] HTTPS enabled (automatic with Vercel)

## Backup Strategy

1. **Code**: GitHub repository (automatic backup)
2. **Content**: Sanity auto-backs up daily
3. **Database**: Supabase auto-backs up
4. **Users**: Clerk auto-backs up

## Support Resources

- **Vercel Support**: https://vercel.com/support
- **Clerk Support**: https://clerk.com/support
- **Sanity Support**: https://www.sanity.io/help
- **Supabase Support**: https://supabase.com/support

---

## Summary

1. ✅ Push code to GitHub
2. ✅ Deploy on Vercel (free)
3. ✅ Configure environment variables
4. ✅ Update external service URLs
5. ✅ Create admin user
6. ✅ Add initial content in Sanity
7. ✅ Process AI knowledge documents
8. ✅ Test full flow
9. ✅ Share URL with users!

Your site is now LIVE and publicly accessible at:
`https://your-project.vercel.app`

**Cost**: ₹0/month until significant traction! 🎉
