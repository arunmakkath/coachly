import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { urlFor } from '@/lib/sanity/client';

interface BlogCardProps {
  post: {
    _id: string;
    title: string;
    slug: { current: string };
    excerpt?: string;
    publishedAt: string;
    coverImage?: any;
    categories?: string[];
    isFree: boolean;
  };
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug.current}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
        {post.coverImage && (
          <div className="relative h-48 w-full">
            <Image
              src={urlFor(post.coverImage).width(400).height(200).url()}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            {!post.isFree && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                Members Only
              </span>
            )}
            {post.categories?.map((category) => (
              <span
                key={category}
                className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded"
              >
                {category}
              </span>
            ))}
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
  );
}
