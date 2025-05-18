import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType } from 'hono';
import { client } from '@/lib/rpc';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type ResponseType = InferResponseType<(typeof client.api.auth.logout)['$post']>;

const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.auth.logout['$post']();

      if (!response.ok) {
        throw new Error('登出失败');
      }

      return await response.json();
    },
    onSuccess: async () => {
      toast.success('登出成功');
      router.refresh();
      await queryClient.invalidateQueries();
    },
    onError: () => {
      toast.error('登出失败');
    },
  });
};

export { useLogout };
