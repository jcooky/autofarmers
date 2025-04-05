import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  const url = `https://api.orca.so/v2/solana/pools/${id}`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!resp.ok) {
    throw new Error(await resp.text());
  }

  const data = await resp.json();
  const tokenASymbol = data.data.tokenA?.symbol;
  const tokenBSymbol = data.data.tokenB?.symbol;
  if (!tokenASymbol || !tokenBSymbol) {
    throw new Error('Token info not found');
  }
  return Response.json({ poolName: `${tokenASymbol}-${tokenBSymbol}` });
}
