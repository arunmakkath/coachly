# Coachly - AI-Powered Coaching Platform

A minimalist, classy coaching platform with AI-powered chatbot support, built with Next.js 14, Sanity CMS, and Gemini AI.

## Features

- **Public Content**: Blog posts, about page, contact form
- **Member Area**: Premium content, exclusive resources, AI chatbot
- **AI Assistant**: RAG-powered chatbot trained on coach's techniques
- **Payment Integration**: Razorpay for Indian market
- **CMS**: Easy-to-use Sanity Studio for content management
- **Authentication**: Clerk with role-based access control

## Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **CMS**: Sanity (cloud-hosted)
- **UI**: Tailwind CSS with Shadcn/UI components
- **Auth**: Clerk
- **Payments**: Razorpay
- **AI**: Google Gemini 1.5 Flash with RAG
- **Vector DB**: Supabase with pgvector
- **Analytics**: Vercel Analytics
- **Testing**: Vitest + Playwright

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Accounts created for:
  - Clerk (https://clerk.com)
  - Sanity (https://sanity.io)
  - Supabase (https://supabase.com)
  - Google AI Studio (https://makersuite.google.com)
  - Razorpay (https://razorpay.com)

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
Copy `.env.example` to `.env.local` and fill in all the required values:

```bash
cp .env.example .env.local
```

### Setting Up Services

#### 1. Clerk Setup

1. Create a new application at https://clerk.com
2. Go to API Keys and copy:
   - Publishable Key → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Secret Key → `CLERK_SECRET_KEY`
3. Configure custom roles:
   - Go to Users & Authentication → Roles
   - Create roles: `public`, `member`, `admin`

#### 2. Sanity Setup

1. Create a new project:
```bash
npm create sanity@latest
```

2. Get your credentials:
   - Project ID → `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - Dataset: `production` → `NEXT_PUBLIC_SANITY_DATASET`
   - Create API token (with Editor permissions) → `SANITY_API_TOKEN`

3. Deploy Sanity Studio:
```bash
npm run dev
```
Access at: http://localhost:3000/studio

#### 3. Supabase Setup

1. Create a new project at https://supabase.com
2. Get your credentials from Project Settings → API:
   - URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service Role Key → `SUPABASE_SERVICE_ROLE_KEY`

3. **IMPORTANT**: Set up the database:

Go to SQL Editor and run this SQL:

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create embeddings table
CREATE TABLE document_embeddings (
  id BIGSERIAL PRIMARY KEY,
  document_id TEXT NOT NULL,
  document_title TEXT,
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER,
  embedding VECTOR(768),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for similarity search
CREATE INDEX ON document_embeddings USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create function for similarity search
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding VECTOR(768),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id BIGINT,
  document_id TEXT,
  document_title TEXT,
  chunk_text TEXT,
  chunk_index INTEGER,
  similarity FLOAT
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    id,
    document_id,
    document_title,
    chunk_text,
    chunk_index,
    1 - (embedding <=> query_embedding) AS similarity
  FROM document_embeddings
  WHERE 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;
```

#### 4. Google Gemini Setup

1. Go to https://makersuite.google.com/app/apikey
2. Create an API key
3. Add to `.env.local` → `GEMINI_API_KEY`

#### 5. Razorpay Setup

1. Sign up at https://razorpay.com
2. Go to Settings → API Keys
3. Generate keys (use test mode for development):
   - Key ID → `RAZORPAY_KEY_ID` and `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - Key Secret → `RAZORPAY_KEY_SECRET`

### Running the Application

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm run test        # Unit tests
npm run test:e2e    # E2E tests
npm run test:all    # All tests
```

Access the application:
- **Frontend**: http://localhost:3000
- **Sanity Studio**: http://localhost:3000/studio

## Project Structure

```
coachly/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public pages
│   ├── (member)/          # Protected member pages
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── layout/           # Header, footer
│   ├── blog/             # Blog components
│   ├── chatbot/          # Chat widget
│   └── checkout/         # Payment components
├── lib/                   # Utilities and clients
│   ├── sanity/           # Sanity client & queries
│   ├── supabase/         # Supabase client & vectors
│   ├── gemini/           # Gemini AI & RAG
│   ├── razorpay/         # Payment integration
│   └── utils/            # Utilities
├── sanity/                # Sanity schemas
├── tests/                 # Test files
└── middleware.ts          # Auth middleware
```

## Usage Guide

### For Admins

#### 1. Access Sanity Studio

Go to http://localhost:3000/studio (or your-domain.com/studio)

#### 2. Configure Site Settings

1. Create a new "Site Settings" document
2. Fill in:
   - Site title
   - Coach name
   - Contact email
   - Membership price (in INR)
   - Razorpay Plan ID (optional)

#### 3. Add Content

**Blog Posts**:
1. Go to "Blog Post" → Create new
2. Fill in title, slug, content
3. Set "Free Content" = true for public posts
4. Set "Free Content" = false for member-only posts

**Knowledge Documents** (for AI training):
1. Go to "Knowledge Document" → Create new
2. Upload PDF or TXT file
3. Click "Generate Embeddings" (admin feature)

#### 4. Process AI Knowledge

After uploading documents:
1. Call `/api/embeddings/generate` with document ID
2. Or use `/api/embeddings/refresh` to reprocess all documents

### For Members

1. **Sign up** at `/sign-up`
2. **Subscribe** at `/checkout`
3. **Access dashboard** at `/dashboard`
4. **Chat with AI** using the floating chat button (bottom-right)

## Deployment

### Deploy to Vercel (100% FREE)

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/coachly.git
git push -u origin main
```

2. **Deploy on Vercel**:
- Go to https://vercel.com
- Click "Add New Project"
- Import your GitHub repository
- Add all environment variables from `.env.local`
- Click "Deploy"

3. **Update Environment URLs**:
- Update `NEXT_PUBLIC_APP_URL` to your Vercel URL
- Update Clerk redirect URLs
- Update Razorpay webhook URL to `https://your-domain.vercel.app/api/webhooks/razorpay`
- Update Sanity CORS settings

Your site will be live at: `https://your-project.vercel.app`

### Custom Domain (Optional)

1. Buy a domain (~₹800/year)
2. In Vercel: Settings → Domains → Add Domain
3. Follow DNS configuration instructions

## API Endpoints

### Public Endpoints

- `POST /api/contact` - Contact form submission

### Member Endpoints

- `POST /api/chat` - AI chatbot (streaming)

### Admin Endpoints

- `POST /api/embeddings/generate` - Process single document
- `POST /api/embeddings/refresh` - Reprocess all documents

### Webhooks

- `POST /api/webhooks/razorpay` - Razorpay payment webhooks

## Testing

### Run Tests

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# All tests
npm run test:all

# With coverage
npm run test:coverage
```

### Test Checklist

- [ ] Public pages load correctly
- [ ] Blog posts filter by role
- [ ] Contact form submits
- [ ] Sign-up flow works
- [ ] Checkout completes (test mode)
- [ ] Member dashboard accessible
- [ ] AI chatbot responds correctly
- [ ] Document upload triggers embeddings
- [ ] Mobile responsive

## Cost Breakdown

All services have generous FREE tiers:

- **Vercel**: Free (100GB bandwidth/month)
- **Sanity**: Free (3 users, 10GB bandwidth)
- **Clerk**: Free (10,000 MAU)
- **Supabase**: Free (500MB DB, 2GB bandwidth)
- **Gemini AI**: Free (1500 requests/day)
- **Razorpay**: 2% transaction fee only

**Estimated Monthly Cost**: ₹0 until significant traction

## Troubleshooting

### Common Issues

1. **Sanity not loading**: Check project ID and dataset name
2. **Auth not working**: Verify Clerk keys and middleware config
3. **AI not responding**: Check Gemini API key and vector DB setup
4. **Payments failing**: Use Razorpay test mode and test cards

### Debug Mode

Set `NODE_ENV=development` to see detailed logs.

## Contributing

This is a private project. For issues, contact the maintainer.

## License

Proprietary - All rights reserved

---

## Next Steps

1. **Fill in environment variables** in `.env.local`
2. **Run the development server**: `npm run dev`
3. **Access Sanity Studio**: http://localhost:3000/studio
4. **Create initial content** (home page, settings, blog posts)
5. **Upload knowledge documents** for AI training
6. **Test the full flow** (signup → payment → AI chat)
7. **Deploy to Vercel** when ready

## Support

For questions or issues:
- Email: your-email@example.com
- Docs: Check this README
- Logs: Check Vercel deployment logs

---

**Built with ❤️ using Next.js, Sanity, and Gemini AI**
