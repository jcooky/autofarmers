import { trendingPoolsSchema } from '@/data/sendai';
import { z } from 'zod';
import { Card } from '../ui/card';
import { TrendingUp } from 'lucide-react';

export default function LiquidPoolTable({
  trendingPools,
}: {
  trendingPools: z.infer<typeof trendingPoolsSchema>;
}) {
  const pools = trendingPools;
  if (pools.length > 5) {
    pools.splice(5);
  }

  return (
    <Card className="w-full rounded-xl p-6 shadow-lg">
      <div className="mb-6 flex items-center gap-2">
        <TrendingUp className="text-purple-500" size={24} />
        <h2 className="text-2xl font-medium">Trending Pools</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-2 py-1.5 text-left font-medium text-gray-600">
                Name
              </th>
              <th className="px-2 py-1.5 text-right font-medium text-gray-600">
                Volume(1H)
              </th>
              <th className="px-2 py-1.5 text-right font-medium text-gray-600">
                Volume(24H)
              </th>
              <th className="px-2 py-1.5 text-right font-medium text-gray-600">
                Reserve($)
              </th>
            </tr>
          </thead>
          <tbody>
            {pools.map((pool, index) => {
              return (
                <tr
                  key={index}
                  className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                >
                  <td className="px-2 py-2 font-medium">
                    {pool.attributes.name}
                  </td>
                  <td className="px-2 py-2 text-right">
                    {Number(pool.attributes.volume_usd.h1).toLocaleString(
                      'en-US',
                      {
                        maximumFractionDigits: 0,
                      },
                    )}
                  </td>
                  <td className="px-2 py-2 text-right">
                    {Number(pool.attributes.volume_usd.h24).toLocaleString(
                      'en-US',
                      {
                        maximumFractionDigits: 0,
                      },
                    )}
                  </td>
                  <td className="px-2 py-2 text-right">
                    {Number(pool.attributes.reserve_in_usd).toLocaleString(
                      'en-US',
                      {
                        maximumFractionDigits: 0,
                      },
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
