import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { TaskStatus } from '@/features/tasks/types';

interface UseGetTasksProps {
  workspaceId: string;
  projectId?: string | null;
  status?: TaskStatus | null;
  search?: string | null;
  assigneeId?: string | null;
  dueDate?: string | null;
}

const useGetTasks = ({
  workspaceId,
  projectId,
  status,
  search,
  assigneeId,
  dueDate,
}: UseGetTasksProps) => {
  return useQuery({
    queryKey: [
      'tasks',
      workspaceId,
      projectId,
      status,
      search,
      assigneeId,
      dueDate,
    ],
    queryFn: async () => {
      const res = await client.api.tasks.$get({
        query: {
          workspaceId,
          projectId: projectId ?? undefined,
          status: status ?? undefined,
          search: search ?? undefined,
          assigneeId: assigneeId ?? undefined,
          dueDate: dueDate ?? undefined,
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
