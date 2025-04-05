import { useQuery } from '@tanstack/react-query';

export function useGetPoolName(poolId: string) {
  return useQuery({
    queryKey: ['poolInfo', { poolId }] as const,
    queryFn: async ({ queryKey: [_, { poolId }] }) => {
      const response = await fetch(`/api/pool_name?id=${poolId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch pool name');
      }

      const data = await response.json();
      if (!data) {
        throw new Error('Failed to fetch pool name');
      }
      return data as {
        poolName: string;
      };
    },
    enabled: !!poolId,
  });
}
