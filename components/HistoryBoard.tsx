import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from '@/data/thread';
import { useMemo } from 'react';
import MyTokenTable from './toolCards/MyTokenTable';
import SwapResult from './toolCards/SwapResult';
import TransactionResult from './toolCards/TransactionResult';

function HistoryItem({ message }: { message: Message }) {
  const { metadata, id } = message;
  const timestamp = new Date(id).toLocaleTimeString();

  return (
    <div className="mb-5 p-3 first:mt-5">
      {metadata.balance && <MyTokenTable balance={metadata.balance} />}

      {metadata.trade && <SwapResult info={metadata.trade} />}

      {metadata.transactionResult && (
        <TransactionResult info={metadata.transactionResult} />
      )}

      <div className="mt-4 flex justify-end">
        <span className="text-muted-foreground text-xs">{timestamp}</span>
      </div>
    </div>
  );
}

export default function HistoryBoard({ messages }: { messages?: Message[] }) {
  const filteredItems = useMemo(() => {
    if (!messages) return [];

    return messages.filter((message) => {
      const { metadata } = message;
      return (
        metadata.balance ||
        (metadata.trade && metadata.trade.status === 'success') ||
        (metadata.transactionResult &&
          metadata.transactionResult.status === 'success')
      );
    });
  }, [messages]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-4 py-3">
        <h2 className="text-xl font-semibold">History</h2>
      </div>

      {filteredItems.length > 0 ? (
        <ScrollArea className="flex-1 px-4">
          {filteredItems.map((message) => (
            <HistoryItem key={`history-item-${message.id}`} message={message} />
          ))}
        </ScrollArea>
      ) : (
        <div className="text-muted-foreground flex h-full items-center justify-center">
          No history available yet.
        </div>
      )}
    </div>
  );
}
