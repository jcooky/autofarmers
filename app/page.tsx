'use client';

import { useCreateThread } from '@/hooks/thread';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  WalletConnectButton,
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Home() {
  const router = useRouter();
  const { mutate: createThread } = useCreateThread({
    onSuccess: ({ threadId }) => {
      router.push('/thread?id=' + threadId);
    },
  });
  const { publicKey } = useWallet();

  useEffect(() => {
    if (!publicKey) return;
    createThread();
  }, [createThread, publicKey]);

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <WalletMultiButton>Connect Wallet</WalletMultiButton>
    </div>
  );
}
