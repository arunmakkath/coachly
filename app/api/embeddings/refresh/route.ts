import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { chunkText } from '@/lib/gemini/rag';
import { generateEmbeddingsBatch } from '@/lib/gemini/client';
import { deleteAllEmbeddings, insertEmbeddings } from '@/lib/supabase/vectors';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Check if external services are configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'AI services not configured. This feature requires Supabase and Gemini API setup.' },
        { status: 503 }
      );
    }

    // Verify user is admin
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const roles = (sessionClaims?.metadata as any)?.role || [];
    const isAdmin = roles.includes('admin');

    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    // Delete all existing embeddings
    await deleteAllEmbeddings();

    // Get all documents from JSON file
    const filePath = path.join(process.cwd(), 'content', 'documents.json');
    const content = await fs.readFile(filePath, 'utf-8');
    const documents = JSON.parse(content);

    if (!documents || documents.length === 0) {
      return NextResponse.json({ message: 'No documents to process' }, { status: 200 });
    }

    let totalChunks = 0;

    // Process each document
    for (const document of documents) {
      if (!document.content) continue;

      try {
        // Chunk the text
        const chunks = chunkText(document.content, 1000);

        // Generate embeddings
        const embeddings = await generateEmbeddingsBatch(chunks);

        // Prepare data for insertion
        const embeddingData = chunks.map((chunk, index) => ({
          document_id: document.id,
          document_title: document.title,
          chunk_text: chunk,
          chunk_index: index,
          embedding: embeddings[index],
          metadata: {
            uploadedAt: document.uploadedAt,
          },
        }));

        // Insert into Supabase
        await insertEmbeddings(embeddingData);

        totalChunks += chunks.length;
      } catch (error) {
        console.error(`Error processing document ${document.id}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      documentsProcessed: documents.length,
      totalChunks,
    });
  } catch (error) {
    console.error('Refresh embeddings error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh embeddings' },
      { status: 500 }
    );
  }
}
