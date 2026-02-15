import { getAllPosts, getAllDocuments } from '@/lib/sanity/queries';
import BlogCard from '@/components/blog/blog-card';

export default async function LibraryPage() {
  const posts = await getAllPosts(false); // Member-only posts
  const documents = await getAllDocuments();

  return (
    <div className="py-12">
      <div className="container">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-neutral-900 mb-8">
          Premium Library
        </h1>

        {/* Premium Blog Posts */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Premium Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts?.map((post: any) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
          {!posts || posts.length === 0 && (
            <p className="text-neutral-600">No premium content available yet.</p>
          )}
        </div>

        {/* Knowledge Documents */}
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Resources & Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents?.map((doc: any) => (
              <div
                key={doc._id}
                className="bg-white p-6 rounded-lg border border-neutral-200 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-neutral-900 mb-2">{doc.title}</h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                </p>
                {doc.fileUrl && (
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Download Document
                  </a>
                )}
              </div>
            ))}
          </div>
          {!documents || documents.length === 0 && (
            <p className="text-neutral-600">No documents available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
