'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Content version - increment this when default content changes
const CONTENT_VERSION = '1.0.0';

export default function HomePage() {
  // Default content - Satheesan Edavath's coaching website
  const defaultContent = {
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
  };

  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    // Load custom content from localStorage if available
    const savedContent = localStorage.getItem('demo_site_content');
    if (savedContent) {
      try {
        const parsed = JSON.parse(savedContent);

        // Check if stored version matches current version
        if (parsed.version !== CONTENT_VERSION) {
          // Version mismatch - reset to new default content
          console.log('Content version updated, resetting to defaults');
          const newContent = {
            ...defaultContent,
            version: CONTENT_VERSION,
          };
          localStorage.setItem('demo_site_content', JSON.stringify(newContent));
          setContent(defaultContent);
        } else {
          // Version matches - use stored content
          setContent({
            heroTitle: parsed.heroTitle || defaultContent.heroTitle,
            heroSubtitle: parsed.heroSubtitle || defaultContent.heroSubtitle,
            aboutTitle: parsed.aboutTitle || defaultContent.aboutTitle,
            aboutContent: parsed.aboutContent || defaultContent.aboutContent,
            philosophyTitle: parsed.philosophyTitle || defaultContent.philosophyTitle,
            philosophyContent: parsed.philosophyContent || defaultContent.philosophyContent,
          });
        }
      } catch (e) {
        console.error('Failed to parse site content', e);
        // On parse error, reset to defaults
        const newContent = {
          ...defaultContent,
          version: CONTENT_VERSION,
        };
        localStorage.setItem('demo_site_content', JSON.stringify(newContent));
        setContent(defaultContent);
      }
    } else {
      // No stored content - save defaults with version
      const newContent = {
        ...defaultContent,
        version: CONTENT_VERSION,
      };
      localStorage.setItem('demo_site_content', JSON.stringify(newContent));
    }
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-neutral-50 to-white py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
              {content.heroTitle}
            </h1>
            <p className="text-xl text-neutral-600 mb-8">
              {content.heroSubtitle}
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/checkout">
                <Button size="lg">
                  Become a Member
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl font-bold text-neutral-900 mb-6 text-center">
              {content.aboutTitle}
            </h2>
            <div className="prose prose-lg mx-auto text-neutral-700">
              <p className="whitespace-pre-wrap">
                {content.aboutContent}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl font-bold text-neutral-900 mb-6 text-center">
              {content.philosophyTitle}
            </h2>
            <div className="prose prose-lg mx-auto text-neutral-700">
              <p className="whitespace-pre-wrap">
                {content.philosophyContent}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center bg-primary/10 rounded-lg p-12">
            <h2 className="font-serif text-3xl font-bold text-neutral-900 mb-4">
              Ready to Elevate Your Leadership?
            </h2>
            <p className="text-lg text-neutral-700 mb-8">
              Join executives who are transforming their leadership with strategic coaching,
              exclusive insights, and 24/7 AI-powered support.
            </p>
            <Link href="/checkout">
              <Button size="lg">
                Start Your Journey Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
