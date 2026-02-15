'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Header() {
  // For now, show a simple header without auth until Clerk is configured
  const isSignedIn = false;
  const isMember = false;

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-serif text-2xl font-bold text-neutral-900">
          Coachly
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-neutral-700 hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/blog" className="text-sm font-medium text-neutral-700 hover:text-primary transition-colors">
            Blog
          </Link>
          <Link href="/about" className="text-sm font-medium text-neutral-700 hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium text-neutral-700 hover:text-primary transition-colors">
            Contact
          </Link>
          {isMember && (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-neutral-700 hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href="/library" className="text-sm font-medium text-neutral-700 hover:text-primary transition-colors">
                Library
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {!isSignedIn ? (
            <>
              <Button variant="ghost" size="sm" disabled title="Configure Clerk to enable authentication">
                Sign In
              </Button>
              <Link href="/checkout">
                <Button size="sm">
                  Become a Member
                </Button>
              </Link>
            </>
          ) : (
            <>
              {!isMember && (
                <Link href="/checkout">
                  <Button size="sm">
                    Become a Member
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
