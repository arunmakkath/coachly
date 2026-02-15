import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12">
      <div className="container max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="font-serif text-4xl font-bold text-neutral-900 mb-4">
            Welcome to the Community!
          </h1>

          <p className="text-lg text-neutral-600 mb-8">
            Your payment was successful. You now have full access to all premium content
            and the AI coaching assistant.
          </p>

          <div className="bg-neutral-50 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-neutral-900 mb-3">What&apos;s Next?</h2>
            <ul className="text-left space-y-2 text-neutral-700">
              <li className="flex items-start">
                <span className="text-primary mr-2">1.</span>
                <span>Explore your member dashboard</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">2.</span>
                <span>Check out the premium content library</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">3.</span>
                <span>Start chatting with the AI assistant</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/library">
              <Button size="lg" variant="outline">
                Browse Library
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
