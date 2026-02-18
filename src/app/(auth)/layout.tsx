'use client';
import Link from 'next/link';
import { PartyPopper } from 'lucide-react';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
        <div className="absolute top-4 left-4">
          <Link href="/" className="flex items-center gap-2 text-foreground">
            <PartyPopper className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">RJ Party Planner</span>
          </Link>
        </div>
        {children}
      </div>
    </FirebaseClientProvider>
  );
}
