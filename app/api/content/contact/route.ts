import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'content', 'contact.json');
    const content = await fs.readFile(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    console.error('Error reading contact content:', error);
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (process.env.NODE_ENV === 'development') {
      const filePath = path.join(process.cwd(), 'content', 'contact.json');
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      return NextResponse.json({ success: true, message: 'Contact info saved' });
    }

    // Production: commit to GitHub
    if (!process.env.GITHUB_TOKEN) {
      return NextResponse.json({
        error: 'GitHub token not configured'
      }, { status: 503 });
    }

    const owner = 'arunmakkath';
    const repo = 'coachly';
    const filePath = 'content/contact.json';
    const content = JSON.stringify(data, null, 2);

    const getFileResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    let sha;
    if (getFileResponse.ok) {
      const fileData = await getFileResponse.json();
      sha = fileData.sha;
    }

    await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Update contact info via CMS',
          content: Buffer.from(content).toString('base64'),
          sha,
        }),
      }
    );

    return NextResponse.json({ success: true, message: 'Contact info saved!' });
  } catch (error) {
    console.error('Error saving contact content:', error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}
