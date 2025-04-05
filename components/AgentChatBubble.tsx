import { ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import MyTokenTable from './toolCards/MyTokenTable';
import LiquidPoolTable from './toolCards/LiquidPoolTable';
import TransactionResult from './toolCards/TransactionResult';
import AgentProfile from './AgentProfile';
import { messageSchema } from '@/data/thread';
import { z } from 'zod';
import MarkdownRenderer from './MarkdownRenderer';
import SwapResult from '@/components/toolCards/SwapResult';

export default function AgentChatBubble({
  agent,
  text = '',
  working = false,
  metadata,
  onRetry,
}: {
  id: number;
  agent: {
    name: string;
    role: string;
    profileImage: string;
  };
  text?: string;
  working?: boolean;
  metadata?: z.infer<typeof messageSchema.shape.metadata>;
  onRetry: () => void;
}) {
  const title = useMemo(() => {
    return `${agent.name} - ${agent.role}`;
  }, [agent]);

  return (
    <div className="flex w-full max-w-[75%] flex-row items-start gap-4 bg-transparent first:mt-5 last:mb-5">
      <AgentProfile profileImage={agent.profileImage} />
      <div className="flex w-full flex-col gap-y-1 pb-2">
        <div className="flex w-full items-center justify-between">
          <span className="flex text-sm font-bold">{title}</span>
          {!working && (
            <div className="flex flex-grow justify-end">
              <ChevronRight className="m-auto flex size-4" />
            </div>
          )}
        </div>
        {working && (
          <div className="flex w-full items-center gap-2">
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                    style={{
                      animationDelay: `${index * 0.2}s`,
                      animationDuration: '0.8s',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        {!working && (
          <div className="bg-muted rounded-lg px-3 py-2 text-sm">
            <MarkdownRenderer
              className="prose prose-sm prose-a:text-primary break-words"
              content={text}
            />
          </div>
        )}
        {metadata && (
          <>
            {metadata['balance'] && <MyTokenTable balance={metadata.balance} />}
            {metadata['trade'] && (
              <SwapResult info={metadata['trade']} onRetry={onRetry} />
            )}
            {metadata['trendingPools'] && (
              <LiquidPoolTable trendingPools={metadata.trendingPools} />
            )}
            {metadata['transactionResult'] && (
              <TransactionResult
                info={metadata.transactionResult}
                onRetry={onRetry}
              />
            )}

            {/*
              {metadata['LiquidPoolPositions'] && (
                <MyPositionTable metadata={metadata} />
              )}
            */}
          </>
        )}
      </div>
    </div>
  );
}
