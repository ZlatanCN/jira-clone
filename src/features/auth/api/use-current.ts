import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

const useCurrent = () => {
  return useQuery({
    queryKey: ['current'],
    queryFn: async () => {
      const res = await client.api.auth.current.$get();

      if (!res.ok) {
        return null;
      }

      const { data } = await res.json();

      return data;
    },
  });
};

export { useCurrent };