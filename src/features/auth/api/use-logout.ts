import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.auth.logout['$post']>;
type RequestType = InferRequestType<typeof client.api.auth.logout['$post']>;

const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseType,
    Error
  >({
    mutationFn: async () => {
      const response = await client.api.auth.logout['$post']();
      return await response.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['current'] });
    },
  });
};

export { useLogout };