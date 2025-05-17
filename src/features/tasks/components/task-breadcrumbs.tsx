import { Project } from '@/features/projects/types';
import { Task } from '@/features/tasks/types';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import Link from 'next/link';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { ChevronRightIcon, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDeleteTask } from '@/features/tasks/api/use-delete-task';
import { useConfirm } from '@/hooks/use-confirm';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface TaskBreadcrumbsProps {
  project: Project;
  task: Task;
}

const TaskBreadcrumbs = ({ project, task }: TaskBreadcrumbsProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useDeleteTask({
    onSuccess: async () => {
      toast.success('任务删除成功');
      router.push(`/workspaces/${workspaceId}/tasks`);
      router.refresh();
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
  const [ConfirmDialog, confirm] = useConfirm(
    '删除任务',
    '此操作不可撤销',
    'destructive',
  );

  const handleDeleteTask = async () => {
    const ok = await confirm();

    if (!ok) {
      return;
    }

    mutate({ param: { taskId: task.$id } });
  };

  return (
    <div className={'flex items-center gap-x-2'}>
      <ConfirmDialog />
      <ProjectAvatar
        name={project.name}
        image={project.imageUrl}
        className={'size-6 lg:size-8'}
      />
      <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
        <p
          className={
            'text-sm font-semibold text-muted-foreground transition hover:opacity-75 lg:text-lg'
          }
        >
          {project.name}
        </p>
      </Link>
      <ChevronRightIcon className={'size-4 text-muted-foreground lg:size-5'} />
      <p className={'text-sm font-semibold lg:text-lg'}>{task.name}</p>
      <Button
        variant={'destructive'}
        size={'sm'}
        disabled={isPending}
        onClick={handleDeleteTask}
        className={'ml-auto'}
      >
        <TrashIcon className={'size-4 lg:mr-2'} />
        <span className={'hidden lg:block'}>删除任务</span>
      </Button>
    </div>
  );
};

export { TaskBreadcrumbs };
