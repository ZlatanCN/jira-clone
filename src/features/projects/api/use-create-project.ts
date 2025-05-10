import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api.projects['$post']>;
type RequestType = InferRequestType<typeof client.api.projects['$post']>;

const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({ form }) => {
      const response = await client.api.projects['$post']({ form });

      if (!response.ok) {
        throw new Error('项目创建失败');
      }

      return await response.json();
    },
    onSuccess: async () => {
      toast.success('项目创建成功');
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: () => {
      toast.error('项目创建失败');
    },
  });
};

export { useCreateProject };