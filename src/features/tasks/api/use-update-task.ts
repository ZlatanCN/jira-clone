import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[':taskId']['$patch'],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)[':taskId']['$patch']
>;

const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.tasks[':taskId']['$patch']({
        json,
        param,
      });

      if (!response.ok) {
        throw new Error('任务更新失败');
      }

      return await response.json();
    },
    onSuccess: async ({ data }) => {
      toast.success('任务更新成功');
      await queryClient.invalidateQueries({ queryKey: ['project-analytics'] });
      await queryClient.invalidateQueries({
        queryKey: ['workspace-analytics'],
      });
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
      await queryClient.invalidateQueries({ queryKey: ['task', data.$id] });
    },
    onError: () => {
      toast.error('任务更新失败');
    },
  });
};

export { useUpdateTask };
