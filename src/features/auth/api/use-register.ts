import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { client } from '@/lib/rpc';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
  (typeof client.api.auth.register)['$post']
>;
type RequestType = InferRequestType<(typeof client.api.auth.register)['$post']>;

export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.register['$post']({ json });

      if (!response.ok) {
        throw new Error('注册失败');
      }

      return await response.json();
    },
    onSuccess: async () => {
      toast.success('注册成功');
      router.refresh();
      await queryClient.invalidateQueries({ queryKey: ['current'] });
    },
    onError: () => {
      toast.error('注册失败');
    },
  });
};
