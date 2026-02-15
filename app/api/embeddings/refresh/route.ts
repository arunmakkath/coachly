import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getAllDocuments } from '@/lib/sanity/queries';
import { chunkText } from '@/lib/gemini/rag';
import { generateEmbeddingsBatch } from '@/lib/gemini/client';
import { deleteAllEmbeddings, insertEmbeddings } from '@/lib/supabase/vectors';
import { sanityWriteClient } from '@/lib/sanity/client';

export async function POST(request: NextRequest) {
  try {
    // Check if external services are configured
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'External services not configured. This feature requires Sanity and Supabase setup.' },
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

    // Get all documents from Sanity
    const documents = await getAllDocuments();

    if (!documents || documents.length === 0) {
      return NextResponse.json({ message: 'No documents to process' }, { status: 200 });
    }

    // Dynamic import of pdf-parser to avoid build-time errors
    const { parsePDFFromURL, cleanText } = await import('@/lib/utils/pdf-parser');

    let totalChunks = 0;

    // Process each document
    for (const document of documents) {
      if (!document.fileUrl) continue;

      try {
        // Parse the PDF
        const parsed = await parsePDFFromURL(document.fileUrl);
        const cleanedText = cleanText(parsed.text);

        // Chunk the text
        const chunks = chunkText(cleanedText, 1000);

        // Generate embeddings
        const embeddings = await generateEmbeddingsBatch(chunks);

        // Prepare data for insertion
        const embeddingData = chunks.map((chunk, index) => ({
          document_id: document._id,
          document_title: document.title,
          chunk_text: chunk,
          chunk_index: index,
          embedding: embeddings[index],
          metadata: {
            numPages: parsed.numPages,
            uploadedAt: document.uploadedAt,
          },
        }));

        // Insert into Supabase
        await insertEmbeddings(embeddingData);

        // Update document status
        await sanityWriteClient
          .patch(document._id)
          .set({
            isProcessed: true,
            vectorCount: chunks.length,
          })
          .commit();

        totalChunks += chunks.length;
      } catch (error) {
        console.error(`Error processing document ${document._id}:`, error);
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
