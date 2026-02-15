import { sanityClient } from './client';

// Query all blog posts with optional isFree filter
export async function getAllPosts(isFree?: boolean) {
  const filter = isFree !== undefined ? `&& isFree == ${isFree}` : '';

  return sanityClient.fetch(
    `*[_type == "post" ${filter}] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      isFree,
      coverImage,
      "categories": categories[]->title
    }`
  );
}

// Query single post by slug
export async function getPostBySlug(slug: string) {
  return sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      isFree,
      coverImage,
      content,
      "categories": categories[]->title
    }`,
    { slug }
  );
}

// Query home page content
export async function getHomeContent() {
  return sanityClient.fetch(
    `*[_type == "home"][0] {
      heroTitle,
      heroSubtitle,
      heroImage,
      aboutTitle,
      aboutContent,
      philosophyTitle,
      philosophyContent
    }`
  );
}

// Query site settings
export async function getSettings() {
  return sanityClient.fetch(
    `*[_type == "settings"][0] {
      siteTitle,
      siteDescription,
      contactEmail,
      coachName,
      membershipPrice,
      razorpayPlanId
    }`
  );
}

// Query all unprocessed documents
export async function getUnprocessedDocuments() {
  return sanityClient.fetch(
    `*[_type == "document" && isProcessed == false] {
      _id,
      title,
      "fileUrl": file.asset->url,
      uploadedAt
    }`
  );
}

// Query all documents
export async function getAllDocuments() {
  return sanityClient.fetch(
    `*[_type == "document"] | order(uploadedAt desc) {
      _id,
      title,
      "fileUrl": file.asset->url,
      uploadedAt,
      isProcessed,
      vectorCount
    }`
  );
}
