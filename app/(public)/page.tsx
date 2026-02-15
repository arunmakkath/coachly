import Link from 'next/link';
import { Button } from '@/components/ui/button';
import fs from 'fs/promises';
import path from 'path';

export default async function HomePage() {
  // Read content from JSON file
  let content;
  try {
    const filePath = path.join(process.cwd(), 'content', 'home.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    content = JSON.parse(fileContent);
  } catch (error) {
    // Fallback to default content
    content = {
      heroTitle: 'Unlock Your Potential with Strategic Executive Coaching',
      heroSubtitle: 'Empowering leaders to navigate business transformation through two decades of global management expertise.',
      aboutTitle: 'About Satheesan',
      aboutContent: 'Professional executive coaching with 20+ years of experience.',
      philosophyTitle: 'My Coaching Philosophy',
      philosophyContent: 'Leadership transformation through systemic team coaching.',
    };
  }

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
              <Link href="/contact">
                <Button size="lg">
                  Get in Touch
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
              Connect with me to learn how strategic coaching can transform your leadership journey.
            </p>
            <Link href="/contact">
              <Button size="lg">
                Contact Me
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
