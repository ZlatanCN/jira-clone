import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[':workspaceId']['join']['$post'],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[':workspaceId']['join']['$post']
>;

const useJoinWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.workspaces[':workspaceId']['join'][
        '$post'
      ]({
        param,
        json,
      });

      if (!response.ok) {
        throw new Error('工作区加入失败');
      }

      return await response.json();
    },
    onSuccess: async ({ data }) => {
      toast.success('工作区加入成功');
      await queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      await queryClient.invalidateQueries({
        queryKey: ['workspace', data.$id],
      });
    },
    onError: () => {
      toast.error('工作区加入失败');
    },
  });
};

export { useJoinWorkspace };
