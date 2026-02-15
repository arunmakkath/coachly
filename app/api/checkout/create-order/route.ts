import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createOrder } from '@/lib/razorpay/client';

export async function POST(request: NextRequest) {
  try {
    // Check if Razorpay is configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        {
          error: 'Payment system not configured',
          message: 'This is a demo environment. To enable payments, configure Razorpay credentials in your environment variables.'
        },
        { status: 503 }
      );
    }

    // Verify user is authenticated
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get amount from request
    const { amount } = await request.json();

    if (!amount || typeof amount !== 'number') {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Create Razorpay order
    const order = await createOrder(amount, 'INR');

    return NextResponse.json(order);
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
