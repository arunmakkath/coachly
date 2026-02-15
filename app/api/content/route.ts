import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'content', 'home.json');
    const content = await fs.readFile(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    console.error('Error reading content:', error);
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // In development, write directly to file
    if (process.env.NODE_ENV === 'development') {
      const filePath = path.join(process.cwd(), 'content', 'home.json');
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      return NextResponse.json({ success: true, message: 'Content saved locally' });
    }

    // In production, use GitHub API to commit
    if (!process.env.GITHUB_TOKEN) {
      return NextResponse.json({
        error: 'GitHub token not configured. Changes saved to browser only.'
      }, { status: 503 });
    }

    const owner = 'arunmakkath';
    const repo = 'coachly';
    const filePath = 'content/home.json';
    const content = JSON.stringify(data, null, 2);
    const message = 'Update homepage content via CMS';

    // Get current file SHA
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

    // Commit the file
    const updateResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          content: Buffer.from(content).toString('base64'),
          sha,
        }),
      }
    );

    if (!updateResponse.ok) {
      throw new Error('Failed to commit to GitHub');
    }

    return NextResponse.json({
      success: true,
      message: 'Content saved and committed to GitHub! Deployment will start automatically.'
    });
  } catch (error) {
    console.error('Error saving content:', error);
    return NextResponse.json(
      { error: 'Failed to save content' },
      { status: 500 }
    );
  }
}
