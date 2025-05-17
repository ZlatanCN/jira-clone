import { Task } from '@/features/tasks/types';
import { Button } from '@/components/ui/button';
import { PencilIcon } from 'lucide-react';
import { DottedSeparator } from '@/components/dotted-separator';
import { OverviewProperty } from '@/features/tasks/components/overview-property';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { TaskDate } from '@/features/tasks/components/task-date';
import { Badge } from '@/components/ui/badge';
import { snakeCaseToTitleCase } from '@/lib/utils';
import { useEditTaskModal } from '@/features/tasks/hooks/use-edit-task-modal';

interface TaskOverviewProps {
  task: Task;
}

const TaskOverview = ({ task }: TaskOverviewProps) => {
  const { open } = useEditTaskModal();

  return (
    <div className={'col-span-1 flex flex-col gap-y-4'}>
      <div className={'rounded-lg bg-muted p-4'}>
        <div className={'flex items-center justify-between'}>
          <p className={'text-lg font-semibold'}>概述</p>
          <Button
            size={'sm'}
            variant={'secondary'}
            onClick={() => open(task.$id)}
          >
            <PencilIcon className={'mr-2 size-4'} />
            编辑
          </Button>
        </div>
        <DottedSeparator className={'my-4'} />
        <div className={'flex flex-col gap-y-4'}>
          <OverviewProperty label={'代理人'}>
            <MemberAvatar name={task.assignee.name} className={'size-6'} />
            <p className={'text-sm font-medium'}>{task.assignee.name}</p>
          </OverviewProperty>
          <OverviewProperty label={'截止时间'}>
            <TaskDate value={task.dueDate} className={'text-sm font-medium'} />
          </OverviewProperty>
          <OverviewProperty label={'状态'}>
            <Badge variant={task.status}>
              {snakeCaseToTitleCase(task.status)}
            </Badge>
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
};

export { TaskOverview };
