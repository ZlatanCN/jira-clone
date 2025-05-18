import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { InferResponseType } from 'hono';

interface UseGetProjectAnalyticsProps {
  projectId: string;
}

type ProjectAnalyticsResponseType = InferResponseType<
  (typeof client.api.projects)[':projectId']['analytics']['$get'],
  200
>;

const useGetProjectAnalytics = ({ projectId }: UseGetProjectAnalyticsProps) => {
  return useQuery({
    queryKey: ['project-analytics', projectId],
    queryFn: async () => {
      const res = await client.api.projects[':projectId']['analytics'].$get({
        param: {
          projectId,
        },
      });

      if (!res.ok) {
        throw new Error('获取项目分析失败');
      }

      const { data } = await res.json();

      return data;
    },
  });
};

export { useGetProjectAnalytics };
export type { ProjectAnalyticsResponseType };
