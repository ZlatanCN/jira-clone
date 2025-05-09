import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api.members[':memberId']['$delete'], 200>;
type RequestType = InferRequestType<typeof client.api.members[':memberId']['$delete']>;

const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({ param }) => {
      const response = await client.api.members[':memberId']['$delete']({
        param,
      });

      if (!response.ok) {
        throw new Error('成员删除失败');
      }

      return await response.json();
    },
    onSuccess: async () => {
      toast.success('成员删除成功');
      await queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: () => {
      toast.error('成员删除失败');
    },
  });
};

export { useDeleteMember };