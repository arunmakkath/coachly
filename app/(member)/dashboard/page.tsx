import { auth, currentUser } from '@clerk/nextjs/server';
import BlogCard from '@/components/blog/blog-card';
import fs from 'fs/promises';
import path from 'path';

// Force dynamic rendering since this page requires authentication
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  // Load posts from JSON
  let recentPosts: any[] = [];
  try {
    const filePath = path.join(process.cwd(), 'content', 'posts.json');
    const content = await fs.readFile(filePath, 'utf-8');
    const allPosts = JSON.parse(content);
    // Filter member-only posts
    recentPosts = allPosts.filter((post: any) => !post.isFree);
  } catch (error) {
    console.error('Failed to load posts:', error);
  }

  const coachName = 'Satheesan'; // Default coach name

  return (
    <div className="py-12">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Welcome back, {user?.firstName || 'Member'}!
          </h1>
          <p className="text-lg text-neutral-600 mb-12">
            Access your exclusive content and chat with {coachName}&apos;s AI assistant.
          </p>

          <div className="grid gap-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg border border-neutral-200">
                <h3 className="text-sm font-medium text-neutral-600 mb-2">Member Since</h3>
                <p className="text-2xl font-bold text-neutral-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-neutral-200">
                <h3 className="text-sm font-medium text-neutral-600 mb-2">Premium Posts</h3>
                <p className="text-2xl font-bold text-neutral-900">{recentPosts?.length || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-neutral-200">
                <h3 className="text-sm font-medium text-neutral-600 mb-2">AI Assistant</h3>
                <p className="text-2xl font-bold text-neutral-900">Active</p>
              </div>
            </div>

            {/* Recent Premium Content */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Recent Premium Content</h2>
              {recentPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recentPosts.slice(0, 4).map((post: any) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <p className="text-neutral-600">No premium content yet.</p>
              )}
            </div>

            {/* AI Chat Introduction */}
            <div className="bg-primary/10 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                24/7 AI Coaching Assistant
              </h2>
              <p className="text-neutral-700 mb-4">
                Have questions? Click the chat button in the bottom-right corner to talk with
                {` ${coachName}'s`} AI assistant, trained on exclusive
                coaching techniques and philosophy.
              </p>
              <p className="text-sm text-neutral-600">
                The AI assistant is available anytime to provide guidance based on proven coaching methods.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
