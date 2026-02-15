'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function StudioPage() {
  const [content, setContent] = useState({
    heroTitle: '',
    heroSubtitle: '',
    aboutTitle: '',
    aboutContent: '',
    philosophyTitle: '',
    philosophyContent: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Load content on mount
  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        setContent(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to load content:', error);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message || 'Content saved successfully!');
      } else {
        setMessage(result.error || 'Failed to save content');
      }
    } catch (error) {
      setMessage('Failed to save content. Please try again.');
    } finally {
      setSaving(false);
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
      <div className="container max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="font-serif text-4xl font-bold text-neutral-900 mb-4">
            Content Studio
          </h1>
          <p className="text-neutral-600 mb-8">
            Edit your site content below. Changes are saved to your GitHub repository.
          </p>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes('success') || message.includes('saved')
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
            }`}>
              {message}
            </div>
          )}

          <div className="space-y-8">
            {/* Hero Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-neutral-900 border-b pb-2">
                Hero Section
              </h2>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Hero Title
                </label>
                <input
                  type="text"
                  value={content.heroTitle}
                  onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Your main headline"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Hero Subtitle
                </label>
                <textarea
                  rows={3}
                  value={content.heroSubtitle}
                  onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Supporting text for your headline"
                />
              </div>
            </div>

            {/* About Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-neutral-900 border-b pb-2">
                About Section
              </h2>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  About Title
                </label>
                <input
                  type="text"
                  value={content.aboutTitle}
                  onChange={(e) => setContent({ ...content, aboutTitle: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="About section heading"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  About Content
                </label>
                <textarea
                  rows={8}
                  value={content.aboutContent}
                  onChange={(e) => setContent({ ...content, aboutContent: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Tell your story..."
                />
              </div>
            </div>

            {/* Philosophy Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-neutral-900 border-b pb-2">
                Philosophy Section
              </h2>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Philosophy Title
                </label>
                <input
                  type="text"
                  value={content.philosophyTitle}
                  onChange={(e) => setContent({ ...content, philosophyTitle: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Philosophy section heading"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Philosophy Content
                </label>
                <textarea
                  rows={8}
                  value={content.philosophyContent}
                  onChange={(e) => setContent({ ...content, philosophyContent: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Share your coaching philosophy..."
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleSave}
                disabled={saving}
                size="lg"
                className="px-8"
              >
                {saving ? 'Saving...' : '💾 Save Changes'}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold text-lg mb-2">How This Works</h2>
          <ul className="text-sm text-neutral-700 space-y-2 list-disc list-inside">
            <li>Content is stored in <code className="bg-neutral-100 px-1 rounded">content/home.json</code></li>
            <li>In development: saves instantly to your local file</li>
            <li>In production: commits to GitHub and triggers auto-deployment</li>
            <li>Changes appear on your site in 1-2 minutes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
