import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[':workspaceId']['reset-invite-code']['$post'],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[':workspaceId']['reset-invite-code']['$post']
>;

const useResetInviteCode = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[':workspaceId'][
        'reset-invite-code'
      ]['$post']({
        param,
      });

      if (!response.ok) {
        throw new Error('邀请码重置失败');
      }

      return await response.json();
    },
    onSuccess: async ({ data }) => {
      toast.success('邀请码重置成功');
      await queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      await queryClient.invalidateQueries({
        queryKey: ['workspace', data.$id],
      });
    },
    onError: () => {
      toast.error('邀请码重置失败');
    },
  });
};

export { useResetInviteCode };
