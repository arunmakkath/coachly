import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getPostBySlug } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/client';
import { auth } from '@clerk/nextjs/server';

export const revalidate = 60;

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

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
              href="/checkout"
              className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
            >
              Become a Member
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="py-12">
      <div className="container max-w-3xl">
        {post.coverImage && (
          <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={urlFor(post.coverImage).width(1200).height(600).url()}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

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
          {/* Simplified content rendering - in production, use @portabletext/react */}
          {post.content && (
            <div>
              {post.content.map((block: any, index: number) => {
                if (block._type === 'block') {
                  return (
                    <p key={index} className="mb-4">
                      {block.children?.map((child: any) => child.text).join('')}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
