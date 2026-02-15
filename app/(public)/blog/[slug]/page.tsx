import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import fs from 'fs/promises';
import path from 'path';

export const revalidate = 0; // Always fetch fresh data

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Read posts from JSON file
  let posts: any[] = [];
  try {
    const filePath = path.join(process.cwd(), 'content', 'posts.json');
    const content = await fs.readFile(filePath, 'utf-8');
    posts = JSON.parse(content);
  } catch (error) {
    console.error('Failed to load posts:', error);
  }

  const post = posts.find(p => p.slug?.current === slug);

  if (!post) {
    notFound();
  }

  // Check if user has access
  const { userId, sessionClaims } = await auth();
  const userRoles = (sessionClaims?.metadata as any)?.role || [];
  const isMember = userRoles.includes('member') || userRoles.includes('admin');

  if (!post.isFree && !isMember) {
    return (
      <div className="py-12">
        <div className="container max-w-3xl">
          <div className="text-center py-12 bg-neutral-50 rounded-lg">
            <h1 className="font-serif text-3xl font-bold text-neutral-900 mb-4">
              Members Only Content
            </h1>
            <p className="text-neutral-600 mb-6">
              This article is available exclusively to our members.
            </p>
            <a
              href="/contact"
              className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="py-12">
      <div className="container max-w-3xl">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-neutral-600 mb-8">
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {post.categories && post.categories.length > 0 && (
            <div className="flex gap-2">
              {post.categories.map((category: string) => (
                <span
                  key={category}
                  className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded text-xs"
                >
                  {category}
                </span>
              ))}
            </div>
          )}
        </div>

        {post.excerpt && (
          <p className="text-xl text-neutral-600 mb-8">{post.excerpt}</p>
        )}

        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap">{post.content}</div>
        </div>
      </div>
    </article>
  );
}
