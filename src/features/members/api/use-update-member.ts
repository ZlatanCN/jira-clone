import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
  (typeof client.api.members)[':memberId']['$patch'],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.members)[':memberId']['$patch']
>;

const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.members[':memberId']['$patch']({
        param,
        json,
      });

      if (!response.ok) {
        throw new Error('成员更新失败');
      }

      return await response.json();
    },
    onSuccess: async () => {
      toast.success('成员更新成功');
      await queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: () => {
      toast.error('成员更新失败');
    },
  });
};

export { useUpdateMember };
