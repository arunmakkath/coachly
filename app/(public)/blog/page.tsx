'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    // Load posts from API
    fetch('/api/content/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error('Failed to load posts:', err));
  }, []);

  return (
    <div className="py-12">
      <div className="container">
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Blog
          </h1>
          <p className="text-lg text-neutral-600">
            Insights, tips, and strategies for personal growth and transformation.
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post._id} href={`/blog/${post.slug.current}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      {!post.isFree && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          Members Only
                        </span>
                      )}
                      {post.isFree && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          Free
                        </span>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <CardDescription>
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </CardDescription>
                  </CardHeader>
                  {post.excerpt && (
                    <CardContent>
                      <p className="text-sm text-neutral-600 line-clamp-3">{post.excerpt}</p>
                    </CardContent>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-neutral-50 rounded-lg">
            <div className="max-w-md mx-auto">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                No Blog Posts Yet
              </h2>
              <p className="text-neutral-600 mb-4">
                Create your first blog post to see it here!
              </p>
              <div className="bg-white p-4 rounded border border-neutral-200 text-left">
                <p className="text-sm text-neutral-700 mb-2">
                  <strong>To add blog posts:</strong>
                </p>
                <ol className="text-sm text-neutral-600 space-y-1 list-decimal list-inside">
                  <li>Visit the <Link href="/studio" className="text-primary hover:underline">Content Studio</Link></li>
                  <li>Click "Add Blog Post"</li>
                  <li>Fill in title, excerpt, and content</li>
                  <li>Save and refresh this page</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
