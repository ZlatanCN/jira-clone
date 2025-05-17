import { Task } from '@/features/tasks/types';
import { Button } from '@/components/ui/button';
import { PencilIcon, XIcon } from 'lucide-react';
import { DottedSeparator } from '@/components/dotted-separator';
import { useState } from 'react';
import { useUpdateTask } from '@/features/tasks/api/use-update-task';
import { Textarea } from '@/components/ui/textarea';

interface TaskDescriptionProps {
  task: Task;
}

const TaskDescription = ({ task }: TaskDescriptionProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [value, setValue] = useState<string | undefined>(task.description);
  const { mutate, isPending } = useUpdateTask();

  const handleSave = () => {
    mutate({ json: { description: value }, param: { taskId: task.$id } });
  };

  return (
    <div className={'rounded-lg border p-4'}>
      <div className={'flex items-center justify-between'}>
        <p className={'text-lg font-semibold'}>概述</p>
        <Button
          size={'sm'}
          variant={'secondary'}
          onClick={() => setIsEditing((prevState) => !prevState)}
        >
          {isEditing ? (
            <XIcon className={'mr-2 size-4'} />
          ) : (
            <PencilIcon className={'mr-2 size-4'} />
          )}
          {isEditing ? '取消' : '编辑'}
        </Button>
      </div>
      <DottedSeparator className={'my-4'} />
      {isEditing ? (
        <div className={'flex flex-col gap-y-4'}>
          <Textarea
            placeholder={'添加一段描述...'}
            value={value}
            rows={4}
            disabled={isPending}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            size={'sm'}
            onClick={handleSave}
            disabled={isPending}
            className={'ml-auto w-fit'}
          >
            {isPending ? '保存中...' : '保存改变'}
          </Button>
        </div>
      ) : (
        <div>
          {task.description || (
            <span className={'text-muted-foreground'}>还没有描述</span>
          )}
        </div>
      )}
    </div>
  );
};

export { TaskDescription };
