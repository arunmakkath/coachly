export default async function CheckoutPage() {
  // Free for testing
  const membershipPrice = 0;

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8">
            <h1 className="font-serif text-4xl font-bold mb-2">
              Become a Member
            </h1>
            <p className="text-xl opacity-90">
              Unlock exclusive content and 24/7 AI coaching support
            </p>
          </div>

          {/* Pricing */}
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-block">
                <div className="text-sm text-neutral-600 mb-2">Membership</div>
                <div className="text-6xl font-bold text-green-600 mb-2">
                  FREE
                </div>
                <div className="text-sm text-neutral-600">for testing</div>
              </div>
            </div>

            {/* Benefits */}
            <div className="max-w-2xl mx-auto mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                What You Get
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-primary mr-3 mt-0.5 flex-shrink-0"
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
                  <div>
                    <h3 className="font-semibold text-neutral-900">Premium Content Library</h3>
                    <p className="text-neutral-600">
                      Access exclusive articles, guides, and resources
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-primary mr-3 mt-0.5 flex-shrink-0"
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
                  <div>
                    <h3 className="font-semibold text-neutral-900">24/7 AI Coaching Assistant</h3>
                    <p className="text-neutral-600">
                      Get instant answers trained on proven coaching techniques
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-primary mr-3 mt-0.5 flex-shrink-0"
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
                  <div>
                    <h3 className="font-semibold text-neutral-900">Exclusive Resources</h3>
                    <p className="text-neutral-600">
                      Download worksheets, templates, and coaching materials
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-primary mr-3 mt-0.5 flex-shrink-0"
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
                  <div>
                    <h3 className="font-semibold text-neutral-900">Priority Support</h3>
                    <p className="text-neutral-600">
                      Get faster responses and personalized guidance
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="text-center">
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                  <p className="text-lg text-green-800 font-semibold mb-2">
                    ✅ Free Access Enabled for Testing
                  </p>
                  <p className="text-sm text-green-700">
                    No payment required. Configure Clerk authentication to enable sign-up, or explore the demo content.
                  </p>
                </div>
                <p className="text-xs text-neutral-500">
                  See QUICKSTART.md for full setup instructions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-8 text-center text-sm text-neutral-600">
          <p>🔒 Secure • Full Access • No Credit Card Required</p>
        </div>
      </div>
    </div>
  );
}
