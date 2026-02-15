# Making Users Members

Since payment was removed, you need to manually assign the "member" role to users.

## Method 1: Via Clerk Dashboard (Easiest)

1. Go to https://dashboard.clerk.com
2. Select your Coachly application
3. Navigate to **Users** in the sidebar
4. Find the user you want to make a member
5. Click on the user
6. Scroll to **Metadata** section
7. Click **Edit** on Public metadata
8. Add this JSON:
   ```json
   {
     "role": ["member"]
   }
   ```
9. Click **Save**

The user will now have access to:
- Member dashboard at `/dashboard`
- Premium library at `/library`
- AI chatbot (floating button in bottom-right)

## Method 2: Via Clerk API (Programmatic)

If you want to create a script or webhook to automatically assign member role:

```javascript
const { clerkClient } = require('@clerk/clerk-sdk-node');

async function makeMember(userId) {
  await clerkClient.users.updateUser(userId, {
    publicMetadata: {
      role: ['member']
    }
  });
}
```

## Testing the AI Chat

After becoming a member:

1. Sign in to your account
2. Go to `/dashboard`
3. Look for a **floating chat button** in the bottom-right corner
4. Click it to open the chat window
5. Ask questions about the coaching techniques you added

## Troubleshooting

**"I don't see the chat button"**
- Make sure you're signed in
- Make sure your user has the "member" role in Clerk metadata
- Check that you're on a member page (`/dashboard` or `/library`)

**"AI chat not configured" error**
- Make sure all environment variables are set in Vercel
- Redeploy after adding environment variables
- Check AI-SETUP.md for complete setup instructions

**"I don't have information about that" responses**
- Make sure you added documents in the studio
- Click "Refresh AI Knowledge" after adding documents
- Wait a few minutes for processing to complete
