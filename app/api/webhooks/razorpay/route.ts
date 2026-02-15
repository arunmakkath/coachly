import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyWebhookSignature } from '@/lib/razorpay/client';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    // Get the webhook signature from headers
    const headersList = await headers();
    const signature = headersList.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    // Get the raw body
    const body = await request.text();

    // Verify the webhook signature
    const isValid = verifyWebhookSignature(body, signature);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Parse the webhook payload
    const payload = JSON.parse(body);
    const event = payload.event;

    // Handle payment success
    if (event === 'payment.captured') {
      const paymentId = payload.payload.payment.entity.id;
      const userId = payload.payload.payment.entity.notes?.userId;

      if (userId) {
        // Update user role to 'member' in Clerk
        const client = await clerkClient();
        await client.users.updateUserMetadata(userId, {
          publicMetadata: {
            role: ['member'],
          },
        });

        console.log(`User ${userId} upgraded to member after payment ${paymentId}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
