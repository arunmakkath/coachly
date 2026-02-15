import Razorpay from 'razorpay';
import crypto from 'crypto';

// Lazy initialization of Razorpay client
let razorpayInstance: Razorpay | null = null;

function getRazorpayClient(): Razorpay {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.');
  }

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  return razorpayInstance;
}

// Create a payment order
export async function createOrder(amount: number, currency: string = 'INR') {
  const razorpay = getRazorpayClient();
  const order = await razorpay.orders.create({
    amount: amount * 100, // Amount in paise
    currency,
    receipt: `receipt_${Date.now()}`,
  });

  return order;
}

// Verify payment signature
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const text = `${orderId}|${paymentId}`;
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(text)
    .digest('hex');

  return generated_signature === signature;
}

// Verify webhook signature
export function verifyWebhookSignature(
  body: string,
  signature: string
): boolean {
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex');

  return generated_signature === signature;
}
