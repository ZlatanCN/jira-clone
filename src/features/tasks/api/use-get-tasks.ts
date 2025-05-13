import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

interface UseGetTasksProps {
  workspaceId: string;
}

const useGetTasks = ({ workspaceId }: UseGetTasksProps) => {
  return useQuery({
    queryKey: ['tasks', workspaceId],
    queryFn: async () => {
      const res = await client.api.tasks.$get({
        query: {
          workspaceId,
        },
      });

      if (!res.ok) {
        throw new Error('获取任务列表失败');
      }

      const { data } = await res.json();

      return data;
    },
  });
};

export { useGetTasks };
