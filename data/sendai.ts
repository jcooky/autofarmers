import { z } from 'zod';

export const balanceSchema = z.object({
  sol: z.number(),
  tokens: z.array(
    z.object({
      tokenAddress: z.string(),
      name: z.string(),
      symbol: z.string(),
      balance: z.number(),
      decimals: z.number(),
    }),
  ),
});

export const tradeSchema = z.object({
  status: z.string(),
  inputAmount: z.number(),
  inputToken: z.string(),
  outputToken: z.string(),
  transaction: z.string(),
  message: z.string(),
});

export const trendingPoolsSchema = z.array(
  z.object({
    id: z.string(),
    attributes: z.object({
      base_token_price_usd: z.string(),
      base_token_price_native_currency: z.string(),
      quote_token_price_usd: z.string(),
      quote_token_price_native_currency: z.string(),
      base_token_price_quote_token: z.string(),
      quote_token_price_base_token: z.string(),
      address: z.string(),
      name: z.string(),
      pool_created_at: z.string(),
      fdv_usd: z.string(),
      market_cap_usd: z.string().nullable(),
      reserve_in_usd: z.string(),
      volume_usd: z.object({
        h1: z.string(),
        h6: z.string(),
        h24: z.string(),
      }),
      price_change_percentage: z.object({
        h1: z.string(),
        h6: z.string(),
        h24: z.string(),
      }),
    }),
  }),
);

export const transactionSchema = z.object({
  poolName: z.string().optional(),
  inputAmount: z.number(),
  inputTokenMint: z.string(),
  priceOffsetBps: z.number(),
  whirlpoolAddress: z.string(),
  status: z.string(),
  message: z.string().optional(),
  signature: z
    .preprocess(
      (arg) => {
        if (typeof arg === 'string') {
          try {
            return JSON.parse(arg);
          } catch (e) {
            throw new Error(`Invalid signature JSON string ${e}`);
          }
        }
        return arg;
      },
      z.object({
        transactionId: z.string(),
        positionMint: z.string(),
      }),
    )
    .optional(),
});

export const liquidPoolPositionsSchema = z.object({
  status: z.string(),
  message: z.string().optional(),
  positions: z.record(
    z.object({
      whirlpoolAddress: z.string(),
    }),
  ),
});
