import { z } from 'zod';
import { balanceSchema } from '@/data/sendai';
import { Card } from '../ui/card';
import { Wallet } from 'lucide-react';

export default function MyTokenTable({
  balance,
}: {
  balance: z.infer<typeof balanceSchema>;
}) {
  const tokens = [
    {
      name: 'SOL',
      amount: balance.sol,
    },
    ...balance.tokens.map((t) => {
      return {
        name: t.symbol,
        amount: t.balance,
      };
    }),
  ];

  return (
    <Card className="w-full max-w-md rounded-xl bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center gap-2">
        <Wallet className="text-purple-500" size={24} />
        <h2 className="text-2xl font-medium">Tokens</h2>
      </div>

      <div className="mt-6 space-y-6">
        {tokens.map((token, index) => (
          <div
            key={index}
            className="mb-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-1 text-sm text-gray-500">Name</div>
                <div className="text-2xl font-bold">{token.name}</div>
              </div>
              <div className="text-right">
                <div className="mb-1 text-sm text-gray-500">Amount</div>
                <div className="text-2xl font-bold">
                  {token.amount.toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
