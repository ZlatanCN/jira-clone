import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

interface UseGetTaskProps {
  taskId: string;
}

const useGetTask = ({ taskId }: UseGetTaskProps) => {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: async () => {
      const res = await client.api.tasks[':taskId'].$get({
        param: {
          taskId,
        },
      });

      if (!res.ok) {
        throw new Error('获取任务失败');
      }

      const { data } = await res.json();

      return data;
    },
  });
};

export { useGetTask };
