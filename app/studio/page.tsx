'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

type Tab = 'content' | 'blog';

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState<Tab>('content');
  const [posts, setPosts] = useState<any[]>([]);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    isFree: true,
  });

  // Site content state - Satheesan Edavath's default content
  const [siteContent, setSiteContent] = useState({
    coachName: 'Satheesan Edavath',
    contactEmail: 'contact@satheesan.com',
    heroTitle: 'Unlock Your Potential with Strategic Executive Coaching',
    heroSubtitle: 'Empowering leaders to navigate business transformation through two decades of global management expertise. My approach combines proven leadership at BOIPL with 24/7 AI-supported coaching for continuous professional growth.',
    aboutTitle: 'About Satheesan',
    aboutContent: `I bring more than 20 years of management experience across diverse product and service organizations in the US, the UK, and India. My leadership journey reached a pivotal chapter in 2014 when I joined British Orient Infotel (BOIPL) as Chief Operating Officer. Over the years, I have been responsible for the company's strategic planning and execution, guiding it through complex mergers and acquisitions and transforming it into a high-performing, professional organization. Currently serving as CEO and Board Member, I understand the intricacies of driving growth in a competitive global landscape.

My transition into coaching was born from the realization that sustainable business success is inseparable from the growth of its people. Throughout my career, I found that my most impactful work occurred while mentoring teams to navigate organizational change and operational challenges. As a Certified Professional Coach and Systemic Team Coach, I have dedicated myself to helping other executives bridge the gap between their current leadership style and their highest potential.

What makes my approach authentic is that it is forged in the reality of the boardroom and the front lines of international operations. I don't offer theoretical advice; I provide strategic partnership based on years of managing cross-geographical teams and delivering large-scale business transformations. My goal is to help you achieve measurable results while building a resilient leadership legacy.`,
    philosophyTitle: 'My Coaching Philosophy',
    philosophyContent: `I believe that leadership transformation is a systemic process. My core belief is that personal growth is the catalyst for organizational excellence. In a rapidly evolving market, a leader's ability to remain agile and strategically aligned is their greatest asset. I coach from a place of partnership, focusing on unlocking the innate potential within you to meet the group's overarching goals and objectives.

My methodology utilizes Systemic Team Coaching and Action-Oriented Mentorship. We examine the entirety of your professional ecosystem—from your internal decision-making processes to the external pressures of global competition. We focus on creating a blueprint for "Professional Maturity," ensuring that every goal we set leads to a tangible, professional transformation that scales alongside your business.

When you work with me, you are choosing a partner who values consistency and accessibility. To ensure your progress remains constant between our deep-dive sessions, I offer a unique 24/7 AI-powered coaching assistant. This tool serves as a digital extension of our work, providing you with resources, accountability, and strategic reflection at any hour, ensuring your journey toward potential never pauses.`,
  });

  useEffect(() => {
    // Load existing blog posts
    const savedPosts = localStorage.getItem('demo_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }

    // Load site content
    const savedContent = localStorage.getItem('demo_site_content');
    if (savedContent) {
      setSiteContent(JSON.parse(savedContent));
    }
  }, []);

  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost = {
      _id: Date.now().toString(),
      ...blogFormData,
      slug: { current: blogFormData.title.toLowerCase().replace(/\s+/g, '-') },
      publishedAt: new Date().toISOString(),
    };

    const existingPosts = JSON.parse(localStorage.getItem('demo_posts') || '[]');
    existingPosts.push(newPost);
    localStorage.setItem('demo_posts', JSON.stringify(existingPosts));

    setPosts(existingPosts);
    setBlogFormData({ title: '', excerpt: '', content: '', isFree: true });
    setShowBlogForm(false);
    alert('Blog post added! Refresh the blog page to see it.');
  };

  const handleContentSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('demo_site_content', JSON.stringify(siteContent));
    alert('Site content saved! Refresh the home page to see changes.');
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container max-w-5xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="font-serif text-4xl font-bold text-neutral-900 mb-4">
            Content Studio (Demo)
          </h1>
          <p className="text-neutral-600 mb-8">
            Manage your site content and blog posts. All changes are stored in your browser.
          </p>

          <div className="mb-8 bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This is a demo mode. Content is stored in your browser's localStorage.
              For production, configure Sanity CMS following QUICKSTART.md
            </p>
          </div>

          {/* Tabs */}
          <div className="border-b border-neutral-200 mb-8">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('content')}
                className={`pb-4 px-2 font-medium transition-colors ${
                  activeTab === 'content'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Site Content
              </button>
              <button
                onClick={() => setActiveTab('blog')}
                className={`pb-4 px-2 font-medium transition-colors ${
                  activeTab === 'blog'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Blog Posts
              </button>
            </div>
          </div>

          {/* Site Content Tab */}
          {activeTab === 'content' && (
            <form onSubmit={handleContentSave} className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
                  Edit Site Content
                </h2>

                {/* General Info */}
                <div className="space-y-6 mb-8">
                  <h3 className="text-lg font-semibold text-neutral-900 border-b pb-2">
                    General Information
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Your Name / Coach Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={siteContent.coachName}
                      onChange={(e) => setSiteContent({ ...siteContent, coachName: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={siteContent.contactEmail}
                      onChange={(e) => setSiteContent({ ...siteContent, contactEmail: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="coach@example.com"
                    />
                  </div>
                </div>

                {/* Hero Section */}
                <div className="space-y-6 mb-8">
                  <h3 className="text-lg font-semibold text-neutral-900 border-b pb-2">
                    Hero Section (Home Page)
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Hero Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={siteContent.heroTitle}
                      onChange={(e) => setSiteContent({ ...siteContent, heroTitle: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Transform Your Life"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Hero Subtitle *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={siteContent.heroSubtitle}
                      onChange={(e) => setSiteContent({ ...siteContent, heroSubtitle: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Professional coaching with AI-powered support..."
                    />
                  </div>
                </div>

                {/* About Section */}
                <div className="space-y-6 mb-8">
                  <h3 className="text-lg font-semibold text-neutral-900 border-b pb-2">
                    About Section (Home Page)
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      About Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={siteContent.aboutTitle}
                      onChange={(e) => setSiteContent({ ...siteContent, aboutTitle: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="About Me"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      About Content *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={siteContent.aboutContent}
                      onChange={(e) => setSiteContent({ ...siteContent, aboutContent: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Write about your background, experience, qualifications..."
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      This appears in the About section on the home page
                    </p>
                  </div>
                </div>

                {/* Philosophy Section */}
                <div className="space-y-6 mb-8">
                  <h3 className="text-lg font-semibold text-neutral-900 border-b pb-2">
                    Philosophy Section (Home Page)
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Philosophy Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={siteContent.philosophyTitle}
                      onChange={(e) => setSiteContent({ ...siteContent, philosophyTitle: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Coaching Philosophy"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Philosophy Content *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={siteContent.philosophyContent}
                      onChange={(e) => setSiteContent({ ...siteContent, philosophyContent: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Describe your coaching philosophy and approach..."
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      This appears in the Philosophy section on the home page
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" size="lg">
                    💾 Save All Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      const savedContent = localStorage.getItem('demo_site_content');
                      if (savedContent) {
                        setSiteContent(JSON.parse(savedContent));
                        alert('Changes discarded');
                      }
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </form>
          )}

          {/* Blog Posts Tab */}
          {activeTab === 'blog' && (
            <div>
              {!showBlogForm ? (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-neutral-900">
                      Blog Posts
                    </h2>
                    <Button onClick={() => setShowBlogForm(true)} size="lg">
                      + Add Blog Post
                    </Button>
                  </div>

                  <div className="mt-8">
                    {posts.length === 0 ? (
                      <div className="text-center py-12 bg-neutral-50 rounded-lg">
                        <p className="text-neutral-600 mb-4">No posts yet. Click "Add Blog Post" to create one.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {posts.map((post) => (
                          <div key={post._id} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                            <p className="text-sm text-neutral-600 mb-2">{post.excerpt}</p>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-1 rounded ${post.isFree ? 'bg-green-100 text-green-800' : 'bg-primary/10 text-primary'}`}>
                                {post.isFree ? 'Free' : 'Members Only'}
                              </span>
                              <span className="text-xs text-neutral-500">
                                {new Date(post.publishedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBlogSubmit} className="space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-neutral-900">
                      New Blog Post
                    </h2>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={blogFormData.title}
                      onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter post title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Excerpt *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={blogFormData.excerpt}
                      onChange={(e) => setBlogFormData({ ...blogFormData, excerpt: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Brief description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Content *
                    </label>
                    <textarea
                      required
                      rows={10}
                      value={blogFormData.content}
                      onChange={(e) => setBlogFormData({ ...blogFormData, content: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Write your blog post content..."
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isFree"
                      checked={blogFormData.isFree}
                      onChange={(e) => setBlogFormData({ ...blogFormData, isFree: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="isFree" className="text-sm text-neutral-700">
                      Free content (accessible to all users)
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" size="lg">Save Post</Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setShowBlogForm(false);
                        setBlogFormData({ title: '', excerpt: '', content: '', isFree: true });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold text-lg mb-4">Setup Real CMS (Optional)</h2>
          <p className="text-sm text-neutral-600 mb-4">
            For production use, set up Sanity CMS:
          </p>
          <ol className="text-sm text-neutral-700 space-y-2 list-decimal list-inside">
            <li>Create account at sanity.io</li>
            <li>Get Project ID and API token</li>
            <li>Update .env.local with credentials</li>
            <li>Access full studio at /studio</li>
          </ol>
          <p className="text-xs text-neutral-500 mt-4">
            See QUICKSTART.md for detailed instructions
          </p>
        </div>
      </div>
    </div>
  );
}
