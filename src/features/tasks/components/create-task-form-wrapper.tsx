import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { Card, CardContent } from '@/components/ui/card';
import { Loader } from 'lucide-react';

interface CreateTaskFormWrapperProps {
  onCancel: () => void;
}

const CreateTaskFormWrapper = ({ onCancel }: CreateTaskFormWrapperProps) => {
  const workspaceId = useWorkspaceId();
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const [projectOptions, memberOptions] = [
    projects?.documents?.map((project) => ({
      id: project.$id,
      name: project.name,
      imageUrl: project.imageUrl,
    })),
    members?.documents?.map((member) => ({
      id: member.$id,
      name: member.name,
    })),
  ];

  if (isLoadingProjects || isLoadingMembers) {
    return (
      <Card className={'h-[714px] w-full border-none shadow-none'}>
        <CardContent className={'flex h-full items-center justify-center'}>
          <Loader className={'size-5 animate-spin text-muted-foreground'} />
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      {JSON.stringify(projectOptions)}
      {JSON.stringify(memberOptions)}
    </div>
  );
};

export { CreateTaskFormWrapper };
