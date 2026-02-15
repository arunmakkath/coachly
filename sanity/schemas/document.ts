import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'knowledgeDocument',
  title: 'Knowledge Document',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'file',
      title: 'File',
      type: 'file',
      options: {
        accept: '.pdf,.txt',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'uploadedAt',
      title: 'Uploaded At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'isProcessed',
      title: 'Processed',
      type: 'boolean',
      description: 'Has this document been processed for AI embeddings?',
      initialValue: false,
      readOnly: true,
    }),
    defineField({
      name: 'vectorCount',
      title: 'Vector Count',
      type: 'number',
      description: 'Number of vector embeddings generated from this document',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      processed: 'isProcessed',
      count: 'vectorCount',
    },
    prepare({ title, processed, count }) {
      return {
        title,
        subtitle: processed ? `Processed (${count || 0} vectors)` : 'Not processed',
      };
    },
  },
});
