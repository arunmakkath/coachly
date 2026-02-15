import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getAllDocuments } from '@/lib/sanity/queries';
import { parsePDFFromURL, cleanText } from '@/lib/utils/pdf-parser';
import { chunkText } from '@/lib/gemini/rag';
import { generateEmbeddingsBatch } from '@/lib/gemini/client';
import { insertEmbeddings } from '@/lib/supabase/vectors';
import { sanityWriteClient } from '@/lib/sanity/client';

export async function POST(request: NextRequest) {
  try {
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

    // Get document ID from request
    const { documentId } = await request.json();

    // Fetch the document from Sanity
    const documents = await getAllDocuments();
    const document = documents?.find((doc: any) => doc._id === documentId);

    if (!document || !document.fileUrl) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Parse the PDF
    const parsed = await parsePDFFromURL(document.fileUrl);
    const cleanedText = cleanText(parsed.text);

    // Chunk the text
    const chunks = chunkText(cleanedText, 1000);

    // Generate embeddings for all chunks
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

    // Update document status in Sanity
    await sanityWriteClient
      .patch(document._id)
      .set({
        isProcessed: true,
        vectorCount: chunks.length,
      })
      .commit();

    return NextResponse.json({
      success: true,
      documentId: document._id,
      chunksProcessed: chunks.length,
    });
  } catch (error) {
    console.error('Embeddings generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate embeddings' },
      { status: 500 }
    );
  }
}
