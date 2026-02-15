import { createClient, SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Lazy initialization for Sanity clients
let clientInstance: SanityClient | null = null;
let writeClientInstance: SanityClient | null = null;

function getProjectId(): string {
  return process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'demo';
}

function getDataset(): string {
  return process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
}

export function getSanityClient(): SanityClient {
  if (!clientInstance) {
    clientInstance = createClient({
      projectId: getProjectId(),
      dataset: getDataset(),
      useCdn: process.env.NODE_ENV === 'production',
      apiVersion: '2024-01-01',
      token: process.env.SANITY_API_TOKEN,
    });
  }
  return clientInstance;
}

export function getSanityWriteClient(): SanityClient {
  if (!writeClientInstance) {
    writeClientInstance = createClient({
      projectId: getProjectId(),
      dataset: getDataset(),
      useCdn: false,
      apiVersion: '2024-01-01',
      token: process.env.SANITY_API_TOKEN,
    });
  }
  return writeClientInstance;
}

// For backward compatibility
export const sanityClient = getSanityClient();
export const sanityWriteClient = getSanityWriteClient();

// Helper for generating image URLs
export function urlFor(source: any) {
  const builder = imageUrlBuilder(getSanityClient());
  return builder.image(source);
}
