import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

interface UseGetProjectsProps {
  workspaceId: string;
}

const useGetProjects = ({ workspaceId }: UseGetProjectsProps) => {
  return useQuery({
    queryKey: ['projects', workspaceId],
    queryFn: async () => {
      const res = await client.api.projects.$get({
        query: {
          workspaceId,
        },
      });

      if (!res.ok) {
        throw new Error('获取项目列表失败');
      }

      const { data } = await res.json();

      return data;
    },
  });
};

export { useGetProjects };
