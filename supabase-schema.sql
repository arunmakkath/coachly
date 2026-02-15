-- Supabase Database Setup for Coachly
-- Run this SQL in Supabase SQL Editor

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create document_embeddings table
CREATE TABLE IF NOT EXISTS document_embeddings (
  id BIGSERIAL PRIMARY KEY,
  document_id TEXT NOT NULL,
  document_title TEXT,
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER,
  embedding VECTOR(768),  -- Gemini text-embedding-004 dimension
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for fast similarity search using ivfflat
CREATE INDEX IF NOT EXISTS document_embeddings_embedding_idx
ON document_embeddings
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create index on document_id for faster lookups
CREATE INDEX IF NOT EXISTS document_embeddings_document_id_idx
ON document_embeddings (document_id);

-- Create function for similarity search
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding VECTOR(768),
  match_threshold FLOAT DEFAULT 0.5,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id BIGINT,
  document_id TEXT,
  document_title TEXT,
  chunk_text TEXT,
  chunk_index INTEGER,
  similarity FLOAT,
  metadata JSONB
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    id,
    document_id,
    document_title,
    chunk_text,
    chunk_index,
    1 - (embedding <=> query_embedding) AS similarity,
    metadata
  FROM document_embeddings
  WHERE 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Create function to delete embeddings by document_id
CREATE OR REPLACE FUNCTION delete_document_embeddings(doc_id TEXT)
RETURNS VOID
LANGUAGE SQL
AS $$
  DELETE FROM document_embeddings WHERE document_id = doc_id;
$$;

-- Grant permissions (adjust as needed)
-- GRANT ALL ON document_embeddings TO authenticated;
-- GRANT EXECUTE ON FUNCTION match_documents TO authenticated;
-- GRANT EXECUTE ON FUNCTION delete_document_embeddings TO authenticated;

-- Verify setup
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'document_embeddings';

-- Test query (should return empty initially)
SELECT COUNT(*) as total_embeddings FROM document_embeddings;

-- Show vector extension version
SELECT * FROM pg_extension WHERE extname = 'vector';
