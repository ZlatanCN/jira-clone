import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

interface UseGetWorkspaceInfoProps {
  workspaceId: string;
}

const useGetWorkspaceInfo = ({ workspaceId }: UseGetWorkspaceInfoProps) => {
  return useQuery({
    queryKey: ['workspace-info', workspaceId],
    queryFn: async () => {
      const res = await client.api.workspaces[':workspaceId']['info'].$get({
        param: {
          workspaceId,
        },
      });

      if (!res.ok) {
        throw new Error('获取工作区信息失败');
      }

      const { data } = await res.json();

      return data;
    },
  });
};

export { useGetWorkspaceInfo };
