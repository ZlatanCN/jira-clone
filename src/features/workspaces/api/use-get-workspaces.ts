import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

const useGetWorkspaces = () => {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const res = await client.api.workspaces.$get();

      if (!res.ok) {
        throw new Error('获取工作区列表失败');
      }

      const { data } = await res.json();

      return data;
    },
  });
};

export { useGetWorkspaces };