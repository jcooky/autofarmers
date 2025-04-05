'use client';

import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  ArrowLeftRight,
  Check,
  Copy,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { tradeSchema } from '@/data/sendai';
import { useGetTokenList } from '@/hooks/token_list';
import { useGetTokenPrice } from '@/hooks/coingecko';
import { zip } from 'lodash-es';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function SwapResultContent({ info }: { info: z.infer<typeof tradeSchema> }) {
  const { data: tokens } = useGetTokenList([info.inputToken, info.outputToken]);
  const { data: tokenPrices } = useGetTokenPrice(
    tokens.map((t) => {
      return {
        id: t?.name ?? '',
        address: t?.address ?? '',
      };
    }),
  );

  const { inputAmount } = info;

  const [fromToken, toToken] = zip(tokens, tokenPrices)
    .filter((t) => t[0] && t[1])
    .map(([t, price]) => {
      return {
        ...t,
        tokenPerUSD: price ?? 0,
      };
    });

  const [outputAmount, outputAmountUSD] = useMemo(() => {
    if (!fromToken || !toToken) return [0, 0];
    const outputAmountPerUSD = inputAmount * fromToken.tokenPerUSD;
    const outputAmount =
      toToken.tokenPerUSD == 0 ? 0 : outputAmountPerUSD / toToken.tokenPerUSD;
    return [outputAmount, outputAmountPerUSD];
  }, [fromToken, toToken, inputAmount]);

  return (
    <CardContent className="pb-4">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-4">
        <div className="space-y-3">
          <p className="text-muted-foreground text-sm font-medium">From</p>
          {fromToken && (
            <div className="space-y-1">
              <p className="font-semibold">{fromToken.symbol}</p>
              <p className="text-2xl font-bold">{inputAmount.toPrecision(2)}</p>
              <p className="text-muted-foreground">
                (${(inputAmount * fromToken.tokenPerUSD).toPrecision(2)})
              </p>
            </div>
          )}
        </div>

        <div className="bg-muted flex items-center justify-center rounded-full p-2">
          <ArrowLeftRight className="text-muted-foreground h-5 w-5" />
        </div>

        {toToken && (
          <div className="space-y-3 text-right">
            <p className="text-muted-foreground text-sm font-medium">To</p>
            <div className="space-y-1">
              <p className="font-semibold">{toToken.symbol}</p>
              <p className="text-2xl font-bold">{outputAmount.toFixed(2)}</p>
              <p className="text-muted-foreground">
                (${outputAmountUSD.toFixed(2)})
              </p>
            </div>
          </div>
        )}
      </div>
    </CardContent>
  );
}

export default function SwapResult({
  info,
  onRetry: handleRetry,
}: {
  info: z.infer<typeof tradeSchema>;
  onRetry?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const { transaction: txId } = { ...info };
  const [retrying, setRetrying] = useState(false);

  const status = useMemo(() => {
    if (!retrying) return info.status;
    else return 'retrying';
  }, [info, retrying]);

  const handleCopyTxId = () => {
    navigator.clipboard.writeText(txId);
    setCopied(true);
    toast.success('Transaction ID has been copied to your clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full max-w-sm border-0 shadow-lg">
      <CardHeader className="space-y-2 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-medium">Transaction</CardTitle>
            {status === 'success' ? (
              <Badge variant="success">
                <Check className="mr-1 h-3 w-3" /> Success
              </Badge>
            ) : status === 'retrying' ? (
              <Badge variant="secondary">
                <Check className="mr-1 h-3 w-3" /> Retry
              </Badge>
            ) : (
              <Badge variant="destructive">
                <Check className="mr-1 h-3 w-3" /> Fail
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 text-xs"
            onClick={() =>
              window.open(`https://explorer.solana.com/tx/${txId}`)
            }
          >
            View <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <span className="truncate">Tx: {txId}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleCopyTxId}
          >
            {copied ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      </CardHeader>
      {status === 'success' && <SwapResultContent info={info} />}
      {status !== 'success' && (
        <>
          <CardContent className="pt-0 pb-2">
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Transaction Failed</AlertTitle>
              <AlertDescription>
                The network is congested.
                <br />
                Please try again.
              </AlertDescription>
            </Alert>
          </CardContent>
          {!retrying && (
            <CardFooter className="flex justify-end gap-2 pt-0">
              <Button
                onClick={() => {
                  setRetrying(true);
                  handleRetry?.();
                }}
                className="flex-1"
              >
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry Transaction
                </>
              </Button>
            </CardFooter>
          )}
        </>
      )}
    </Card>
  );
}
