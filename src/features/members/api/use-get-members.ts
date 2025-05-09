import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

interface UseGetMembersProps {
  workspaceId: string;
}

const useGetMembers = ({
  workspaceId,
}: UseGetMembersProps) => {
  return useQuery({
    queryKey: ['members', workspaceId],
    queryFn: async () => {
      const res = await client.api.members.$get({ query: { workspaceId } });

      if (!res.ok) {
        throw new Error('获取成员列表失败');
      }

      const { data } = await res.json();

      return data;
    },
  });
};

export { useGetMembers };