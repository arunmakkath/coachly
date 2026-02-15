# AI Coaching Setup Guide

This guide explains how to enable the AI-powered coaching assistant feature.

## Prerequisites

1. **Supabase Account** (free tier available at https://supabase.com)
2. **Gemini API Key** (free tier available at https://aistudio.google.com/app/apikey)

## Step 1: Set Up Supabase Database

1. Create a new project in Supabase
2. Go to the SQL Editor
3. Copy and paste the contents of `supabase-setup.sql`
4. Run the SQL script to create the vector database tables

## Step 2: Configure Environment Variables

Add the following environment variables to your `.env.local` (development) and Vercel (production):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Gemini AI
GEMINI_API_KEY=your-gemini-api-key
```

### Where to find these values:

**Supabase:**
- Go to Project Settings → API
- Copy the Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- Copy the `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy the `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`

**Gemini API:**
- Go to https://aistudio.google.com/app/apikey
- Create a new API key
- Copy the key → `GEMINI_API_KEY`

## Step 3: Add Knowledge Documents

1. Log in to your site as admin
2. Go to `/studio`
3. Click on the "AI Knowledge" tab
4. Click "Add New Document"
5. Add a title and paste your coaching content
6. Click "Add Document"
7. Click "Save All Documents"
8. Click "Refresh AI Knowledge" to process the documents

**Important:** The "Refresh AI Knowledge" step processes your documents and generates embeddings. This may take a few minutes depending on the amount of content.

## Step 4: Test the AI Assistant

1. Go to your website homepage
2. Look for the floating chat button in the bottom-right corner
3. Click it and ask a question about your coaching techniques

The AI will respond based on the knowledge documents you added.

## Features

- **RAG (Retrieval-Augmented Generation):** The AI searches through your knowledge base to find relevant information before answering
- **Context-Aware:** Responses are based on your actual coaching techniques and philosophy
- **Public Access:** Available to all visitors on your website
- **Always Available:** 24/7 access to coaching insights

## Troubleshooting

### "AI chat not configured" error
- Make sure all environment variables are set correctly
- Restart your development server or redeploy on Vercel

### No responses from AI
- Check that you've added documents in the studio
- Make sure you clicked "Refresh AI Knowledge" after adding documents
- Verify your Gemini API key is valid

### Empty or generic responses
- Add more detailed content to your knowledge documents
- Make sure the documents contain information relevant to the questions being asked
- Re-run "Refresh AI Knowledge" if you updated documents

## Cost Estimates

- **Supabase:** Free tier includes 500MB database (enough for thousands of coaching documents)
- **Gemini API:** Free tier includes 1500 requests/day (plenty for a growing coaching business)

Both services have generous free tiers that should cover your needs for the first 6-12 months.
