import fs from 'fs/promises';
import path from 'path';

export default async function AboutPage() {
  // Read about content from JSON file
  let about;
  try {
    const filePath = path.join(process.cwd(), 'content', 'about.json');
    const content = await fs.readFile(filePath, 'utf-8');
    about = JSON.parse(content);
  } catch (error) {
    about = {
      title: 'About',
      content: 'Welcome to Coachly. Edit this page in the Content Studio.',
    };
  }

  return (
    <div className="py-12">
      <div className="container max-w-3xl">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-neutral-900 mb-8">
          {about.title}
        </h1>
        <div className="prose prose-lg text-neutral-700 whitespace-pre-wrap">
          {about.content}
        </div>
      </div>
    </div>
  );
}
