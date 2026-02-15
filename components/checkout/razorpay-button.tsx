'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayButtonProps {
  amount: number;
  planId?: string;
}

export default function RazorpayButton({ amount, planId }: RazorpayButtonProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = async () => {
        // Create order
        const orderResponse = await fetch('/api/checkout/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount }),
        });

        const order = await orderResponse.json();

        // Configure Razorpay
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: 'Coachly',
          description: 'Membership Subscription',
          order_id: order.id,
          handler: function (response: any) {
            // Payment successful
            window.location.href = '/checkout/success';
          },
          prefill: {
            name: user?.fullName || '',
            email: user?.emailAddresses[0]?.emailAddress || '',
          },
          notes: {
            userId: user?.id,
          },
          theme: {
            color: '#D4AF37',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        setLoading(false);
      };
    } catch (error) {
      console.error('Payment error:', error);
      setLoading(false);
    }
  };

  return (
    <Button onClick={handlePayment} disabled={loading} size="lg">
      {loading ? 'Loading...' : 'Subscribe Now'}
    </Button>
  );
}
