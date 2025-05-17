import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type ResponseType = InferResponseType<
  (typeof client.api.projects)[':projectId']['$delete'],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.projects)[':projectId']['$delete']
>;

const useDeleteProject = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.projects[':projectId']['$delete']({
        param,
      });

      if (!response.ok) {
        throw new Error('项目删除失败');
      }

      return await response.json();
    },
    onSuccess: async ({ data }) => {
      toast.success('项目删除成功');
      router.refresh();
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
      await queryClient.invalidateQueries({ queryKey: ['projects', data.$id] });
    },
    onError: () => {
      toast.error('项目删除失败');
    },
  });
};

export { useDeleteProject };
