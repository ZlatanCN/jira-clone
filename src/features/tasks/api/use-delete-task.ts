import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[':taskId']['$delete'],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)[':taskId']['$delete']
>;

const useDeleteTask = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.tasks[':taskId']['$delete']({ param });

      if (!response.ok) {
        throw new Error('任务删除失败');
      }

      return await response.json();
    },
    onSuccess: async ({ data }) => {
      toast.success('任务删除成功');

      router.refresh();
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
      await queryClient.invalidateQueries({ queryKey: ['tasks', data.$id] });
    },
    onError: () => {
      toast.error('任务删除失败');
    },
  });
};

export { useDeleteTask };
