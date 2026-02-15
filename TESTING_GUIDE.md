# Local Testing Guide - Coachly

## ✅ Server Status

**Dev server is running at**: http://localhost:3000

The server started successfully in 1.3 seconds!

## 🧪 How to Test

### 1. Open the Site

Open your browser and visit: **http://localhost:3000**

You should see the Coachly home page with:
- Hero section
- About section
- Philosophy section
- "Become a Member" button

### 2. Test Navigation

Click through the navigation:
- **Home** - Landing page
- **Blog** - Blog listing (will be empty without Sanity content)
- **About** - About page
- **Contact** - Contact form

### 3. Test UI Components

**Public Pages**:
- ✅ Header navigation
- ✅ Footer
- ✅ Responsive design (resize browser window)
- ✅ Contact form (won't send email without setup)

### 4. Test Authentication (Limited)

**Note**: Authentication won't fully work without Clerk setup, but you can:
- Click "Sign In" button (will show Clerk error)
- Click "Become a Member" button (will redirect to checkout)

### 5. Test Chatbot UI (Visual Only)

**To see the chatbot**:
1. You need to be signed in as a member
2. Since we don't have real auth, you can temporarily test by:
   - Opening `/dashboard` directly
   - The chatbot won't connect to API but you can see the UI

**Alternative**: I can create a demo page to showcase the chatbot without auth.

## 🎨 What You Can See

### Working Features (No Setup Needed):
- ✅ **Home page** - Full layout and design
- ✅ **Navigation** - Header and footer
- ✅ **Blog listing** - Layout (empty until you add content)
- ✅ **About page** - Static content
- ✅ **Contact form** - UI (won't send email)
- ✅ **Checkout page** - Design and layout
- ✅ **Responsive design** - Works on mobile/tablet/desktop
- ✅ **Theme** - Minimalist gold/charcoal/white theme

### Limited Features (Need API Keys):
- ⚠️ **Authentication** - Needs Clerk keys
- ⚠️ **Blog content** - Needs Sanity content
- ⚠️ **Payments** - Needs Razorpay keys
- ⚠️ **AI Chatbot** - Needs Gemini + Supabase setup
- ⚠️ **Member area** - Needs authentication

## 🔍 Test Each Page

### Test #1: Home Page
```
URL: http://localhost:3000
```
**What to check**:
- [ ] Hero section loads
- [ ] "Become a Member" button visible
- [ ] Sections scroll smoothly
- [ ] Footer links present
- [ ] Mobile responsive (resize browser)

### Test #2: Blog Page
```
URL: http://localhost:3000/blog
```
**What to check**:
- [ ] Page loads without errors
- [ ] Empty state message (no posts yet)
- [ ] Layout looks good

### Test #3: About Page
```
URL: http://localhost:3000/about
```
**What to check**:
- [ ] Page loads
- [ ] Placeholder content visible
- [ ] Layout consistent with site

### Test #4: Contact Page
```
URL: http://localhost:3000/contact
```
**What to check**:
- [ ] Form fields present (Name, Email, Message)
- [ ] Send button visible
- [ ] Form looks professional
- [ ] Can type in fields

### Test #5: Checkout Page
```
URL: http://localhost:3000/checkout
```
**What to check**:
- [ ] Pricing displayed
- [ ] Benefits listed
- [ ] "Subscribe Now" button present
- [ ] Design matches theme

## 📱 Test Mobile Responsiveness

1. **Open Chrome DevTools**: Press F12 or Cmd+Option+I
2. **Toggle device mode**: Click phone icon or press Cmd+Shift+M
3. **Test different devices**:
   - iPhone 12 Pro
   - iPad
   - Pixel 5

**What to check**:
- [ ] Navigation menu works
- [ ] Text is readable
- [ ] Buttons are touchable
- [ ] Layout doesn't break
- [ ] Images scale properly

## ⚠️ Expected Errors

You'll see some errors because services aren't configured yet:

### Console Errors (Expected):
```
Clerk: Publishable key not valid
Sanity: Failed to fetch content
Supabase: Connection failed
```

**This is NORMAL!** These errors won't appear once you add real API keys.

### What Should NOT Error:
- Page loading
- Navigation
- Layout rendering
- Styling
- Responsive design

## 🎯 Quick Visual Test

**5-Minute Test**:
1. ✅ Visit home page - looks professional?
2. ✅ Click all nav links - pages load?
3. ✅ Resize browser - responsive?
4. ✅ Check colors - gold/charcoal theme?
5. ✅ Try contact form - fields work?

If all 5 pass → **UI is perfect!** ✨

## 🚀 Next Steps

### To Test Full Functionality:

1. **Set up services** (30 minutes):
   - Follow QUICKSTART.md
   - Get API keys from Clerk, Sanity, etc.
   - Update .env.local with real values

2. **Add content** (10 minutes):
   - Access Sanity Studio at /studio
   - Create blog posts
   - Upload knowledge documents

3. **Test member features**:
   - Sign up
   - Make payment (test mode)
   - Access dashboard
   - Try AI chatbot

## 🛠️ Troubleshooting

### Server not starting?
```bash
# Stop the server (Ctrl+C)
# Clean and restart
rm -rf .next
npm run dev
```

### Port 3000 already in use?
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Or use different port
PORT=3001 npm run dev
```

### Styling looks broken?
```bash
# Reinstall dependencies
rm -rf node_modules .next
npm install
npm run dev
```

## 📊 Test Results Template

Use this to track your testing:

```
[ ] Home page loads correctly
[ ] Navigation works
[ ] Blog page displays
[ ] About page loads
[ ] Contact form UI works
[ ] Checkout page displays
[ ] Mobile responsive
[ ] Colors/theme correct
[ ] No critical errors
[ ] Performance is good
```

## 🎨 Visual Inspection Checklist

**Design Quality**:
- [ ] Professional appearance
- [ ] Consistent spacing
- [ ] Readable typography
- [ ] Color scheme (gold accents)
- [ ] Button styles
- [ ] Form styling
- [ ] Footer design
- [ ] Mobile layout

## 💡 Pro Tips

1. **Test in multiple browsers**:
   - Chrome
   - Firefox
   - Safari (if on Mac)

2. **Check console** (F12):
   - Red errors? Expected for missing APIs
   - Yellow warnings? Usually safe to ignore

3. **Test performance**:
   - Pages should load instantly
   - No lag when clicking
   - Smooth scrolling

4. **Take screenshots**:
   - Save what works well
   - Note what needs adjustment

## 📝 Feedback Checklist

After testing, note:
- [ ] What looks great
- [ ] What needs polish
- [ ] Any bugs found
- [ ] Feature suggestions
- [ ] UX improvements

## 🎉 Success Criteria

The test is successful if:
- ✅ All pages load without crashes
- ✅ Design looks professional
- ✅ Navigation works smoothly
- ✅ Mobile responsive
- ✅ No critical console errors
- ✅ Forms are usable
- ✅ Theme matches (gold/charcoal/white)

---

**Current Status**: Server running at http://localhost:3000

**Ready to test!** Open your browser and explore! 🚀
