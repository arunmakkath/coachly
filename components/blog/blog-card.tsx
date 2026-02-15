import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BlogCardProps {
  post: {
    _id?: string;
    id?: string;
    title: string;
    slug: { current: string } | any;
    excerpt?: string;
    publishedAt: string;
    categories?: string[];
    isFree: boolean;
  };
}

export default function BlogCard({ post }: BlogCardProps) {
  // Handle both Sanity and file-based slug formats
  const slug = typeof post.slug === 'string' ? post.slug : post.slug?.current;

  return (
    <Link href={`/blog/${slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
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
