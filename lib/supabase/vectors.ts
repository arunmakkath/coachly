import { supabaseAdmin } from './client';

export interface DocumentEmbedding {
  id?: number;
  document_id: string;
  document_title: string;
  chunk_text: string;
  chunk_index: number;
  embedding: number[];
  metadata?: Record<string, any>;
}

// Insert embeddings into the database
export async function insertEmbeddings(embeddings: DocumentEmbedding[]) {
  const { data, error } = await supabaseAdmin
    .from('document_embeddings')
    .insert(embeddings)
    .select();

  if (error) {
    throw new Error(`Failed to insert embeddings: ${error.message}`);
  }

  return data;
}

// Search for similar embeddings using cosine similarity
export async function searchSimilarEmbeddings(
  queryEmbedding: number[],
  limit: number = 5,
  threshold: number = 0.5
) {
  const { data, error } = await supabaseAdmin.rpc('match_documents', {
    query_embedding: queryEmbedding,
    match_threshold: threshold,
    match_count: limit,
  });

  if (error) {
    throw new Error(`Failed to search embeddings: ${error.message}`);
  }

  return data;
}

// Delete all embeddings for a document
export async function deleteDocumentEmbeddings(documentId: string) {
  const { error } = await supabaseAdmin
    .from('document_embeddings')
    .delete()
    .eq('document_id', documentId);

  if (error) {
    throw new Error(`Failed to delete embeddings: ${error.message}`);
  }
}

// Delete all embeddings
export async function deleteAllEmbeddings() {
  const { error } = await supabaseAdmin
    .from('document_embeddings')
    .delete()
    .neq('id', 0); // Delete all rows

  if (error) {
    throw new Error(`Failed to delete all embeddings: ${error.message}`);
  }
}

// Get total count of embeddings
export async function getEmbeddingsCount() {
  const { count, error } = await supabaseAdmin
    .from('document_embeddings')
    .select('*', { count: 'exact', head: true });

  if (error) {
    throw new Error(`Failed to count embeddings: ${error.message}`);
  }

  return count || 0;
}
