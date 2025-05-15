import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ExternalLinkIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { useConfirm } from '@/hooks/use-confirm';
import { useDeleteTask } from '@/features/tasks/api/use-delete-task';

interface TaskActionsProps {
  id: string;
  projectId: string;
  children?: React.ReactNode;
}

const TaskActions = ({ id, projectId, children }: TaskActionsProps) => {
  const [ConfirmDialog, confirm] = useConfirm(
    'Delete task',
    'This action cannot be undone',
    'destructive',
  );
  const { mutate, isPending } = useDeleteTask();
  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;
    mutate({ param: { taskId: id } });
  };

  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => {}}
            className={'p-[10px] font-medium'}
          >
            <ExternalLinkIcon className="mr-2 h-4 w-4 stroke-2" />
            任务细节
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {}}
            className={'p-[10px] font-medium'}
          >
            <ExternalLinkIcon className="mr-2 h-4 w-4 stroke-2" />
            打开项目
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {}}
            className={'p-[10px] font-medium'}
          >
            <PencilIcon className="mr-2 h-4 w-4 stroke-2" />
            编辑任务
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(onDelete) => {
              isPending;
            }}
            disabled={false}
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
