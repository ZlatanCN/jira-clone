import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api.workspaces['$post']>;
type RequestType = InferRequestType<typeof client.api.workspaces['$post']>;

const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({ form }) => {
      const response = await client.api.workspaces['$post']({ form });

      if (!response.ok) {
        throw new Error('工作区创建失败');
      }

      return await response.json();
    },
    onSuccess: async () => {
      toast.success('工作区创建成功');
      await queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
    onError: () => {
      toast.error('工作区创建失败');
    },
  });
};

export { useCreateWorkspace };