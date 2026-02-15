import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

// Model for chat (Gemini 1.5 Flash)
export const chatModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

// Model for embeddings
export const embeddingModel = genAI.getGenerativeModel({
  model: 'text-embedding-004',
});

// Generate text embedding
export async function generateEmbedding(text: string): Promise<number[]> {
  const result = await embeddingModel.embedContent(text);
  return result.embedding.values;
}

// Generate embeddings in batch
export async function generateEmbeddingsBatch(texts: string[]): Promise<number[][]> {
  const embeddings = await Promise.all(
    texts.map(text => generateEmbedding(text))
  );
  return embeddings;
}

// Generate chat response
export async function generateChatResponse(
  prompt: string,
  systemPrompt?: string
): Promise<string> {
  const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;

  const result = await chatModel.generateContent(fullPrompt);
  const response = result.response;
  return response.text();
}

// Generate streaming chat response
export async function* generateStreamingChatResponse(
  prompt: string,
  systemPrompt?: string
) {
  const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;

  const result = await chatModel.generateContentStream(fullPrompt);

  for await (const chunk of result.stream) {
    const text = chunk.text();
    yield text;
  }
}
