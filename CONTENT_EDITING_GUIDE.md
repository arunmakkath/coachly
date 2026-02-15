# Content Editing Guide - Coachly

This guide shows you how to edit all the content on your coaching website without touching any code!

## How to Access the Content Studio

1. Open your browser
2. Go to: **http://localhost:3000/studio**
3. You'll see two tabs: **Site Content** and **Blog Posts**

---

## Editing Site Content

### Step 1: Go to Site Content Tab

Click on the **"Site Content"** tab at the top of the page.

### Step 2: Fill in Your Information

You'll see several sections to edit:

#### General Information
- **Your Name / Coach Name**: Enter your full name (e.g., "Sarah Johnson")
- **Contact Email**: Your email address for inquiries

#### Hero Section (Top of Home Page)
- **Hero Title**: Main headline visitors see first (e.g., "Transform Your Life Through Coaching")
- **Hero Subtitle**: Supporting text under the title (e.g., "Certified life coach helping you achieve your goals with personalized guidance")

#### About Section (Home Page)
- **About Title**: Usually "About Me" or "About [Your Name]"
- **About Content**: Write about:
  - Your background and experience
  - Your qualifications/certifications
  - What makes your approach unique
  - Why you became a coach

**Example**:
```
I'm a certified life coach with over 10 years of experience helping individuals
transform their lives. After experiencing my own personal breakthrough, I dedicated
my career to helping others discover their potential and achieve their dreams.

My background in psychology and mindfulness practices allows me to offer a holistic
approach to coaching that addresses both mind and spirit.
```

#### Philosophy Section (Home Page)
- **Philosophy Title**: Usually "Coaching Philosophy" or "My Approach"
- **Philosophy Content**: Describe:
  - Your coaching methodology
  - Your core beliefs about personal growth
  - What clients can expect from working with you

**Example**:
```
I believe everyone has untapped potential waiting to be discovered. My coaching
philosophy centers on empowerment, accountability, and sustainable growth.

Through a combination of active listening, powerful questions, and evidence-based
techniques, I help clients break through limiting beliefs and create lasting change.
```

### Step 3: Save Your Changes

1. Click the **"💾 Save All Changes"** button at the bottom
2. You'll see a confirmation message
3. Refresh your home page (http://localhost:3000) to see the changes!

### Step 4: Reset if Needed

If you want to undo changes:
- Click **"Reset"** to go back to your last saved version

---

## Adding Blog Posts

### Step 1: Go to Blog Posts Tab

Click on the **"Blog Posts"** tab at the top.

### Step 2: Create a New Post

1. Click **"+ Add Blog Post"** button
2. Fill in the form:

   - **Title**: Your blog post headline (e.g., "5 Steps to Achieve Your Goals")
   - **Excerpt**: Short summary (1-2 sentences) that appears in the blog list
   - **Content**: Full article content (can be multiple paragraphs)
   - **Free content checkbox**:
     - ✅ Checked = Everyone can read it
     - ❌ Unchecked = Only members can read it

3. Click **"Save Post"**

### Step 3: View Your Blog Post

1. Go to http://localhost:3000/blog
2. Your new post will appear in the grid!
3. Click on it to see the full post

### Step 4: Managing Posts

All your blog posts are listed in the "Blog Posts" tab. You can see:
- Post title
- Excerpt
- Free or Members Only badge
- Publication date

---

## Tips for Writing Great Content

### For Your About Section
- Be authentic and personal
- Highlight your unique qualifications
- Explain your "why" - what drives you
- Keep it conversational and warm
- Length: 2-3 paragraphs is perfect

### For Your Philosophy Section
- Be specific about your approach
- Use clear, simple language
- Explain the benefits clients will experience
- Avoid jargon
- Length: 2-3 paragraphs

### For Blog Posts
- Use an attention-grabbing title
- Write a compelling excerpt (this is what appears in the blog list)
- Break content into short paragraphs for readability
- Add line breaks between paragraphs
- Use conversational tone
- End with a call-to-action or question

---

## Common Questions

### Q: How do I add images?
A: In demo mode, images aren't supported yet. When you upgrade to Sanity CMS (see QUICKSTART.md), you'll be able to add images.

### Q: Can I delete or edit posts after creating them?
A: In demo mode, you can't edit posts yet. You can clear all posts by clearing your browser data, then start fresh.

### Q: Will my content be saved if I close the browser?
A: Yes! All content is stored in your browser's localStorage. It will stay there until you:
- Clear browser data
- Use a different browser
- Use incognito/private mode

### Q: How do I make this permanent?
A: For a production website, you'll need to:
1. Follow the QUICKSTART.md guide to set up Sanity CMS
2. Deploy to Vercel (free hosting)
3. Then all content will be stored in the cloud permanently

### Q: Can multiple people edit content?
A: In demo mode, no - content is stored locally in each person's browser. Once you set up Sanity CMS, multiple people can edit from anywhere!

---

## Quick Checklist

Before launching your site, make sure you've edited:

- [ ] Your name
- [ ] Contact email
- [ ] Hero title
- [ ] Hero subtitle
- [ ] About section (personalize it!)
- [ ] Philosophy section (explain your approach)
- [ ] At least 2-3 blog posts
- [ ] Test all pages to see your content

---

## Getting Help

If something isn't working:
1. Make sure you're on http://localhost:3000/studio
2. Check that the development server is running (npm run dev)
3. Try refreshing the page
4. Check the browser console for errors (F12 key)

---

## What's Next?

Once you're happy with your content in demo mode:

1. **Review everything**: Click through all pages and read your content
2. **Test on mobile**: Resize your browser to see how it looks on phones
3. **Share for feedback**: Ask friends to review it
4. **Deploy**: Follow QUICKSTART.md to make it live on the internet!

---

**Remember**: You can edit your content anytime! Just go to `/studio`, make changes, and save. It's that simple!

Enjoy building your coaching website! 🎉
