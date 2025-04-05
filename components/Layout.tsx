'use client';

import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, PropsWithChildren, useState } from 'react';
import WalletProvider from '@/components/WalletProvider';

export default function Layout({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <QueryClientProvider client={queryClient}>
          <WalletProvider>{children}</WalletProvider>
        </QueryClientProvider>
        <Toaster />
      </Suspense>
    </>
  );
}
