import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

interface UseGetWorkspaceProps {
  workspaceId: string;
}

const useGetWorkspace = ({ workspaceId }: UseGetWorkspaceProps) => {
  return useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: async () => {
      const res = await client.api.workspaces[':workspaceId'].$get({
        param: {
          workspaceId,
        },
      });

      if (!res.ok) {
        throw new Error('获取工作区失败');
      }

      const { data } = await res.json();

      return data;
    },
  });
};

export { useGetWorkspace };
