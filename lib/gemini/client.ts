import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

// Lazy initialization
let genAIInstance: GoogleGenerativeAI | null = null;
let chatModelInstance: GenerativeModel | null = null;
let embeddingModelInstance: GenerativeModel | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAIInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API not configured. Set GEMINI_API_KEY environment variable.');
    }
    genAIInstance = new GoogleGenerativeAI(apiKey);
  }
  return genAIInstance;
}

// Model for chat (Gemini 1.5 Flash)
function getChatModel(): GenerativeModel {
  if (!chatModelInstance) {
    chatModelInstance = getGenAI().getGenerativeModel({
      model: 'gemini-1.5-flash',
    });
  }
  return chatModelInstance;
}

// Model for embeddings
function getEmbeddingModel(): GenerativeModel {
  if (!embeddingModelInstance) {
    embeddingModelInstance = getGenAI().getGenerativeModel({
      model: 'text-embedding-004',
    });
  }
  return embeddingModelInstance;
}

// For backward compatibility
export const chatModel = new Proxy({} as GenerativeModel, {
  get(_target, prop) {
    return getChatModel()[prop as keyof GenerativeModel];
  }
});

export const embeddingModel = new Proxy({} as GenerativeModel, {
  get(_target, prop) {
    return getEmbeddingModel()[prop as keyof GenerativeModel];
  }
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
