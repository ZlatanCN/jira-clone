import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api.workspaces[':workspaceId']['$delete'], 200>;
type RequestType = InferRequestType<typeof client.api.workspaces[':workspaceId']['$delete']>;

const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[':workspaceId']['$delete']({
        param,
      });

      if (!response.ok) {
        throw new Error('工作区删除失败');
      }

      return await response.json();
    },
    onSuccess: async ({ data }) => {
      toast.success('工作区删除成功');
      await queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      await queryClient.invalidateQueries({
        queryKey: ['workspace', data.$id],
      });
    },
    onError: () => {
      toast.error('工作区删除失败');
    },
  });
};

export { useDeleteWorkspace };