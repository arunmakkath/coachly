import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      validation: Rule => Rule.email(),
    }),
    defineField({
      name: 'coachName',
      title: 'Coach Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'membershipPrice',
      title: 'Membership Price (INR)',
      type: 'number',
      description: 'Monthly membership price in Indian Rupees',
    }),
    defineField({
      name: 'razorpayPlanId',
      title: 'Razorpay Plan ID',
      type: 'string',
      description: 'Razorpay subscription plan ID',
    }),
  ],
  preview: {
    select: {
      title: 'siteTitle',
    },
  },
});
