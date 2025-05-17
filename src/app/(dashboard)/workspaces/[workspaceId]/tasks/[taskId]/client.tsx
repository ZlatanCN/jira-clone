'use client';

import { useTaskId } from '@/features/tasks/hooks/use-task-id';
import { useGetTask } from '@/features/tasks/api/use-get-task';
import { PageLoader } from '@/components/page-loader';
import { PageError } from '@/components/page-error';
import { TaskBreadcrumbs } from '@/features/tasks/components/task-breadcrumbs';
import { DottedSeparator } from '@/components/dotted-separator';
import { TaskOverview } from '@/features/tasks/components/task-overview';
import { TaskDescription } from '@/features/tasks/components/task-description';

const TaskIdClient = () => {
  const taskId = useTaskId();
  const { data, isLoading } = useGetTask({ taskId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!data) {
    return <PageError message={'任务不存在'} />;
  }

  return (
    <div className={'flex flex-col'}>
      <TaskBreadcrumbs project={data.project} task={data} />
      <DottedSeparator className={'my-6'} />
      <div className={'grid grid-cols-1 gap-4 lg:grid-cols-2'}>
        <TaskOverview task={data} />
        <TaskDescription task={data} />
      </div>
    </div>
  );
};

export { TaskIdClient };
