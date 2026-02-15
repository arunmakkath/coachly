'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

type Tab = 'home' | 'about' | 'contact' | 'blog' | 'documents';

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Home content
  const [homeContent, setHomeContent] = useState({
    heroTitle: '',
    heroSubtitle: '',
    aboutTitle: '',
    aboutContent: '',
    philosophyTitle: '',
    philosophyContent: '',
  });

  // About content
  const [aboutContent, setAboutContent] = useState({
    title: '',
    content: '',
  });

  // Contact content
  const [contactContent, setContactContent] = useState({
    email: '',
    phone: '',
    address: '',
  });

  // Blog posts
  const [posts, setPosts] = useState<any[]>([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [postForm, setPostForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    isFree: true,
  });

  // Knowledge documents
  const [documents, setDocuments] = useState<any[]>([]);
  const [showDocForm, setShowDocForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState<any>(null);
  const [docForm, setDocForm] = useState({
    title: '',
    content: '',
  });
  const [refreshingAI, setRefreshingAI] = useState(false);

  // Load all content on mount
  useEffect(() => {
    Promise.all([
      fetch('/api/content').then(r => r.json()),
      fetch('/api/content/about').then(r => r.json()),
      fetch('/api/content/contact').then(r => r.json()),
      fetch('/api/content/posts').then(r => r.json()),
      fetch('/api/content/documents').then(r => r.json()),
    ])
      .then(([home, about, contact, posts, documents]) => {
        setHomeContent(home);
        setAboutContent(about);
        setContactContent(contact);
        setPosts(posts);
        setDocuments(documents);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to load content:', error);
        setLoading(false);
      });
  }, []);

  const handleSaveHome = async () => {
    setSaving(true);
    setMessage('');
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(homeContent),
      });
      const result = await response.json();
      setMessage(result.message || 'Home content saved!');
    } catch (error) {
      setMessage('Failed to save home content');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAbout = async () => {
    setSaving(true);
    setMessage('');
    try {
      const response = await fetch('/api/content/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutContent),
      });
      const result = await response.json();
      setMessage(result.message || 'About content saved!');
    } catch (error) {
      setMessage('Failed to save about content');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveContact = async () => {
    setSaving(true);
    setMessage('');
    try {
      const response = await fetch('/api/content/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactContent),
      });
      const result = await response.json();
      setMessage(result.message || 'Contact info saved!');
    } catch (error) {
      setMessage('Failed to save contact info');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePosts = async () => {
    setSaving(true);
    setMessage('');
    try {
      const response = await fetch('/api/content/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(posts),
      });
      const result = await response.json();
      setMessage(result.message || 'Blog posts saved!');
    } catch (error) {
      setMessage('Failed to save blog posts');
    } finally {
      setSaving(false);
    }
  };

  const handleAddPost = () => {
    if (!postForm.title || !postForm.content) {
      setMessage('Please fill in title and content');
      return;
    }

    const newPost = {
      id: editingPost?.id || Date.now().toString(),
      title: postForm.title,
      slug: postForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt: postForm.excerpt,
      content: postForm.content,
      isFree: postForm.isFree,
      publishedAt: editingPost?.publishedAt || new Date().toISOString(),
    };

    if (editingPost) {
      setPosts(posts.map(p => p.id === editingPost.id ? newPost : p));
    } else {
      setPosts([newPost, ...posts]);
    }

    setPostForm({ title: '', excerpt: '', content: '', isFree: true });
    setEditingPost(null);
    setShowPostForm(false);
    setMessage('Post added! Click "Save All Posts" to save changes.');
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setPostForm({
      title: post.title,
      excerpt: post.excerpt || '',
      content: post.content,
      isFree: post.isFree,
    });
    setShowPostForm(true);
  };

  const handleDeletePost = (postId: string) => {
    if (confirm('Delete this post?')) {
      setPosts(posts.filter(p => p.id !== postId));
      setMessage('Post deleted! Click "Save All Posts" to save changes.');
    }
  };

  // Document handlers
  const handleSaveDocuments = async () => {
    setSaving(true);
    setMessage('');
    try {
      const response = await fetch('/api/content/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(documents),
      });
      const result = await response.json();
      setMessage(result.message || 'Documents saved!');
    } catch (error) {
      setMessage('Failed to save documents');
    } finally {
      setSaving(false);
    }
  };

  const handleAddDocument = () => {
    if (!docForm.title || !docForm.content) {
      alert('Please fill in all fields');
      return;
    }

    const newDoc = {
      id: editingDoc?.id || `doc-${Date.now()}`,
      title: docForm.title,
      content: docForm.content,
      uploadedAt: editingDoc?.uploadedAt || new Date().toISOString(),
    };

    if (editingDoc) {
      setDocuments(documents.map(d => d.id === editingDoc.id ? newDoc : d));
    } else {
      setDocuments([newDoc, ...documents]);
    }

    setDocForm({ title: '', content: '' });
    setEditingDoc(null);
    setShowDocForm(false);
    setMessage('Document added! Click "Save All Documents" to save changes.');
  };

  const handleEditDocument = (doc: any) => {
    setEditingDoc(doc);
    setDocForm({
      title: doc.title,
      content: doc.content,
    });
    setShowDocForm(true);
  };

  const handleDeleteDocument = (docId: string) => {
    if (confirm('Delete this document? This will also remove it from AI knowledge after refresh.')) {
      setDocuments(documents.filter(d => d.id !== docId));
      setMessage('Document deleted! Click "Save All Documents" and then "Refresh AI Knowledge" to update.');
    }
  };

  const handleRefreshAI = async () => {
    if (!confirm('This will regenerate all AI embeddings. Continue?')) {
      return;
    }

    setRefreshingAI(true);
    setMessage('Processing documents and generating embeddings... This may take a few minutes.');

    try {
      const response = await fetch('/api/embeddings/refresh', {
        method: 'POST',
      });
      const result = await response.json();

      if (result.success) {
        setMessage(`Success! Processed ${result.documentsProcessed} documents with ${result.totalChunks} chunks.`);
      } else {
        setMessage(result.error || 'Failed to refresh AI knowledge');
      }
    } catch (error) {
      setMessage('Failed to refresh AI knowledge');
    } finally {
      setRefreshingAI(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <p className="text-lg text-neutral-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container max-w-5xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="font-serif text-4xl font-bold text-neutral-900 mb-2">
            Content Studio
          </h1>
          <p className="text-neutral-600 mb-8">
            Manage all your site content in one place
          </p>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes('saved') || message.includes('Success')
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
            }`}>
              {message}
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-neutral-200 mb-8">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'home'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Home Page
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'about'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                About Page
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'contact'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Contact Info
              </button>
              <button
                onClick={() => setActiveTab('blog')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'blog'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Blog Posts ({posts.length})
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'documents'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                AI Knowledge ({documents.length})
              </button>
            </div>
          </div>

          {/* Home Tab */}
          {activeTab === 'home' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Hero Section</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Hero Title</label>
                    <input
                      type="text"
                      value={homeContent.heroTitle}
                      onChange={(e) => setHomeContent({...homeContent, heroTitle: e.target.value})}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
                    <textarea
                      rows={3}
                      value={homeContent.heroSubtitle}
                      onChange={(e) => setHomeContent({...homeContent, heroSubtitle: e.target.value})}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">About Section</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">About Title</label>
                    <input
                      type="text"
                      value={homeContent.aboutTitle}
                      onChange={(e) => setHomeContent({...homeContent, aboutTitle: e.target.value})}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">About Content</label>
                    <textarea
                      rows={8}
                      value={homeContent.aboutContent}
                      onChange={(e) => setHomeContent({...homeContent, aboutContent: e.target.value})}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Philosophy Section</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Philosophy Title</label>
                    <input
                      type="text"
                      value={homeContent.philosophyTitle}
                      onChange={(e) => setHomeContent({...homeContent, philosophyTitle: e.target.value})}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Philosophy Content</label>
                    <textarea
                      rows={8}
                      value={homeContent.philosophyContent}
                      onChange={(e) => setHomeContent({...homeContent, philosophyContent: e.target.value})}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveHome} disabled={saving}>
                {saving ? 'Saving...' : '💾 Save Home Page'}
              </Button>
            </div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Page Title</label>
                <input
                  type="text"
                  value={aboutContent.title}
                  onChange={(e) => setAboutContent({...aboutContent, title: e.target.value})}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                  rows={15}
                  value={aboutContent.content}
                  onChange={(e) => setAboutContent({...aboutContent, content: e.target.value})}
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="Tell your full story..."
                />
              </div>
              <Button onClick={handleSaveAbout} disabled={saving}>
                {saving ? 'Saving...' : '💾 Save About Page'}
              </Button>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={contactContent.email}
                  onChange={(e) => setContactContent({...contactContent, email: e.target.value})}
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  value={contactContent.phone}
                  onChange={(e) => setContactContent({...contactContent, phone: e.target.value})}
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="+91 1234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <input
                  type="text"
                  value={contactContent.address}
                  onChange={(e) => setContactContent({...contactContent, address: e.target.value})}
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="City, Country"
                />
              </div>
              <Button onClick={handleSaveContact} disabled={saving}>
                {saving ? 'Saving...' : '💾 Save Contact Info'}
              </Button>
            </div>
          )}

          {/* Blog Tab */}
          {activeTab === 'blog' && !showPostForm && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">All Blog Posts</h2>
                <Button onClick={() => setShowPostForm(true)}>+ Add New Post</Button>
              </div>

              {posts.length > 0 ? (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-4 flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{post.title}</h3>
                        {post.excerpt && <p className="text-sm text-neutral-600 mt-1">{post.excerpt}</p>}
                        <div className="flex gap-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded ${post.isFree ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {post.isFree ? 'Free' : 'Members Only'}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {new Date(post.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPost(post)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-neutral-50 rounded-lg">
                  <p className="text-neutral-600 mb-4">No blog posts yet</p>
                  <Button onClick={() => setShowPostForm(true)}>Create Your First Post</Button>
                </div>
              )}

              {posts.length > 0 && (
                <Button onClick={handleSavePosts} disabled={saving} className="w-full">
                  {saving ? 'Saving...' : '💾 Save All Posts'}
                </Button>
              )}
            </div>
          )}

          {/* Blog Post Form */}
          {activeTab === 'blog' && showPostForm && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">{editingPost ? 'Edit Post' : 'New Blog Post'}</h2>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPostForm(false);
                    setEditingPost(null);
                    setPostForm({ title: '', excerpt: '', content: '', isFree: true });
                  }}
                >
                  ← Back to Posts
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={postForm.title}
                  onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="Your post title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Excerpt</label>
                <textarea
                  rows={2}
                  value={postForm.excerpt}
                  onChange={(e) => setPostForm({...postForm, excerpt: e.target.value})}
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="Brief summary (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Content *</label>
                <textarea
                  rows={15}
                  value={postForm.content}
                  onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="Write your post content..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFree"
                  checked={postForm.isFree}
                  onChange={(e) => setPostForm({...postForm, isFree: e.target.checked})}
                  className="w-4 h-4"
                />
                <label htmlFor="isFree" className="text-sm">
                  Free content (accessible to all visitors)
                </label>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleAddPost}>
                  {editingPost ? 'Update Post' : 'Add Post'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPostForm(false);
                    setEditingPost(null);
                    setPostForm({ title: '', excerpt: '', content: '', isFree: true });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-8">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">AI Knowledge Base</h3>
              <p className="text-sm text-blue-800 mb-3">
                Add documents containing your coaching techniques, philosophies, and methods.
                The AI assistant will use this knowledge to answer member questions.
              </p>
              <p className="text-sm text-blue-700">
                After adding or editing documents, click "Refresh AI Knowledge" to process them.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Button onClick={() => setShowDocForm(true)}>
                Add New Document
              </Button>
              <Button
                onClick={handleSaveDocuments}
                disabled={saving}
                variant="outline"
              >
                {saving ? 'Saving...' : 'Save All Documents'}
              </Button>
              <Button
                onClick={handleRefreshAI}
                disabled={refreshingAI || documents.length === 0}
                variant="outline"
                className="bg-green-50 hover:bg-green-100 text-green-700"
              >
                {refreshingAI ? 'Processing...' : 'Refresh AI Knowledge'}
              </Button>
            </div>

            {/* Documents List */}
            {documents.length > 0 ? (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="border border-neutral-200 rounded-lg p-6 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-neutral-900">{doc.title}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditDocument(doc)}
                          className="text-sm text-primary hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="text-sm text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 mb-2">
                      Added: {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                    <p className="text-neutral-700 line-clamp-3">{doc.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-neutral-50 rounded-lg">
                <p className="text-neutral-600">No documents yet. Add your first coaching document!</p>
              </div>
            )}

            {/* Document Form */}
            {showDocForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                  <h3 className="text-2xl font-semibold mb-6">
                    {editingDoc ? 'Edit Document' : 'Add New Document'}
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Document Title</label>
                      <input
                        type="text"
                        value={docForm.title}
                        onChange={(e) => setDocForm({...docForm, title: e.target.value})}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-md"
                        placeholder="e.g., Executive Coaching Framework"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Content</label>
                      <textarea
                        value={docForm.content}
                        onChange={(e) => setDocForm({...docForm, content: e.target.value})}
                        rows={15}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-md font-mono text-sm"
                        placeholder="Paste your coaching content here..."
                      />
                      <p className="text-xs text-neutral-500 mt-1">
                        {docForm.content.length} characters
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <Button onClick={handleAddDocument}>
                        {editingDoc ? 'Update Document' : 'Add Document'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowDocForm(false);
                          setEditingDoc(null);
                          setDocForm({ title: '', content: '' });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
