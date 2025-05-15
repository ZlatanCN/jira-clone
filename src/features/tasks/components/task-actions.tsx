import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ExternalLinkIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { useConfirm } from '@/hooks/use-confirm';
import { useDeleteTask } from '@/features/tasks/api/use-delete-task';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useEditTaskModal } from '@/features/tasks/hooks/use-edit-task-modal';

interface TaskActionsProps {
  id: string;
  projectId: string;
  children?: React.ReactNode;
}

const TaskActions = ({ id, projectId, children }: TaskActionsProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm(
    '删除任务',
    '此操作不可撤销',
    'destructive',
  );
  const { mutate, isPending } = useDeleteTask();
  const { open } = useEditTaskModal();

  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;
    mutate({ param: { taskId: id } });
  };

  const onOpenTask = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };

  const onOpenProject = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
  };

  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={onOpenTask}
            className={'p-[10px] font-medium'}
          >
            <ExternalLinkIcon className="mr-2 h-4 w-4 stroke-2" />
            任务细节
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onOpenProject}
            className={'p-[10px] font-medium'}
          >
            <ExternalLinkIcon className="mr-2 h-4 w-4 stroke-2" />
            打开项目
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => open(id)}
            className={'p-[10px] font-medium'}
          >
            <PencilIcon className="mr-2 h-4 w-4 stroke-2" />
            编辑任务
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            disabled={isPending}
            className={
              'p-[10px] font-medium text-amber-700 focus:text-amber-700'
            }
          >
            <TrashIcon className="mr-2 h-4 w-4 stroke-2" />
            删除任务
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export { TaskActions };
