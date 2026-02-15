import { generateEmbedding } from './client';
import { searchSimilarEmbeddings } from '../supabase/vectors';
import fs from 'fs/promises';
import path from 'path';

export interface RetrievedContext {
  text: string;
  documentTitle: string;
  similarity: number;
}

// Retrieve relevant context for a user query
export async function retrieveContext(
  query: string,
  limit: number = 5
): Promise<RetrievedContext[]> {
  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query);

  // Search for similar documents
  const results = await searchSimilarEmbeddings(queryEmbedding, limit, 0.5);

  return results.map((result: any) => ({
    text: result.chunk_text,
    documentTitle: result.document_title,
    similarity: result.similarity,
  }));
}

// Build system prompt with retrieved context
export async function buildRAGPrompt(
  query: string,
  context: RetrievedContext[]
): Promise<string> {
  // Get coach name from home content
  let coachName = 'the coach';
  try {
    const filePath = path.join(process.cwd(), 'content', 'home.json');
    const content = await fs.readFile(filePath, 'utf-8');
    const homeData = JSON.parse(content);
    // Extract coach name from hero title or about content if available
    coachName = 'Satheesan'; // Default for now, can be made dynamic
  } catch (error) {
    console.error('Failed to load coach name:', error);
  }

  const contextText = context
    .map((ctx, idx) => `[Context ${idx + 1} from "${ctx.documentTitle}"]:\n${ctx.text}`)
    .join('\n\n');

  const systemPrompt = `You are ${coachName}'s AI assistant. Your role is to answer questions about ${coachName}'s coaching techniques and philosophy using ONLY the provided context.

Context from ${coachName}'s knowledge base:
${contextText}

Instructions:
- Answer the question using ONLY information from the provided context
- Be conversational and helpful, as if you were ${coachName} speaking directly
- If the context doesn't contain enough information to answer the question, politely respond: "I don't have information about that in my current knowledge base. I recommend booking a 1-on-1 session with ${coachName} to discuss this further."
- Don't make up information or use knowledge outside the provided context
- Keep responses concise but informative

User Question: ${query}`;

  return systemPrompt;
}

// Simple text chunking function
export function chunkText(text: string, maxChunkSize: number = 1000): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/[.!?]\s+/);

  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? '. ' : '') + sentence;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
