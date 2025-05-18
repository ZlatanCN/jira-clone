import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
  (typeof client.api.tasks)['bulk-update']['$post'],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)['bulk-update']['$post']
>;

const useBulkUpdateTasks = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks['bulk-update']['$post']({
        json,
      });

      if (!response.ok) {
        throw new Error('任务列表更新失败');
      }

      return await response.json();
    },
    onSuccess: async () => {
      toast.success('任务列表更新成功');
      await queryClient.invalidateQueries({ queryKey: ['project-analytics'] });
      await queryClient.invalidateQueries({
        queryKey: ['workspace-analytics'],
      });
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: () => {
      toast.error('任务列表更新失败');
    },
  });
};

export { useBulkUpdateTasks };
