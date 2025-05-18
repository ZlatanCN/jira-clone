import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferResponseType } from 'hono';

interface UseGetWorkspaceAnalyticsProps {
  workspaceId: string;
}

type WorkspaceAnalyticsResponseType = InferResponseType<
  (typeof client.api.workspaces)[':workspaceId']['analytics']['$get'],
  200
>;

const useGetWorkspaceAnalytics = ({
  workspaceId,
}: UseGetWorkspaceAnalyticsProps) => {
  return useQuery({
    queryKey: ['workspace-analytics', workspaceId],
    queryFn: async () => {
      const res = await client.api.workspaces[':workspaceId']['analytics'].$get(
        {
          param: {
            workspaceId,
          },
        },
      );

      if (!res.ok) {
        throw new Error('获取工作区分析失败');
      }

      const { data } = await res.json();

      return data;
    },
  });
};

export { useGetWorkspaceAnalytics };
export type { WorkspaceAnalyticsResponseType };
