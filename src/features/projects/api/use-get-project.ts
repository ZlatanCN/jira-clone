import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

interface UseGetProjectProps {
  projectId: string;
}

const useGetProject = ({ projectId }: UseGetProjectProps) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const res = await client.api.projects[':projectId'].$get({
        param: {
          projectId,
        },
      });

      if (!res.ok) {
        throw new Error('获取项目失败');
      }

      const { data } = await res.json();

      return data;
    },
  });
};

export { useGetProject };
