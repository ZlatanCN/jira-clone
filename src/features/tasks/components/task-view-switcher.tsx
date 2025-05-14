'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader, PlusIcon } from 'lucide-react';
import { DottedSeparator } from '@/components/dotted-separator';
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal';
import { useGetTasks } from '@/features/tasks/api/use-get-tasks';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useQueryState } from 'nuqs';
import { DataFilters } from '@/features/tasks/components/data-filters';

const TaskViewSwitcher = () => {
  const [view, setView] = useQueryState('task-view', {
    defaultValue: 'table',
  });
  const workspaceId = useWorkspaceId();

  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
  });
  const { open } = useCreateTaskModal();

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className={'w-full flex-1 rounded-lg border'}
    >
      <div className={'flex h-full flex-col overflow-auto p-4'}>
        <div
          className={
            'flex flex-col items-center justify-between gap-y-2 lg:flex-row'
          }
        >
          <TabsList className={'w-full lg:w-auto'}>
            <TabsTrigger value={'table'} className={'h-8 w-full lg:w-auto'}>
              表格
            </TabsTrigger>
            <TabsTrigger value={'kanban'} className={'h-8 w-full lg:w-auto'}>
              看板
            </TabsTrigger>
            <TabsTrigger value={'calendar'} className={'h-8 w-full lg:w-auto'}>
              日历
            </TabsTrigger>
          </TabsList>
          <Button size={'sm'} onClick={open} className={'w-full lg:w-auto'}>
            <PlusIcon className={'mr-2 size-4'} />
            新建
          </Button>
        </div>
        <DottedSeparator className={'my-4'} />
        <DataFilters />
        <DottedSeparator className={'my-4'} />
        {isLoadingTasks ? (
          <div className="flex h-[200px] w-full flex-col items-center justify-center rounded-lg border">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value={'table'} className={'mt-0'}>
              {JSON.stringify(tasks)}
            </TabsContent>
            <TabsContent value={'kanban'} className={'mt-0'}>
              {JSON.stringify(tasks)}
            </TabsContent>
            <TabsContent value={'calendar'} className={'mt-0'}>
              {JSON.stringify(tasks)}
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};

export { TaskViewSwitcher };
