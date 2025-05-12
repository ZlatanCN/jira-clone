'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { DottedSeparator } from '@/components/dotted-separator';
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal';

const TaskViewSwitcher = () => {
  const { open } = useCreateTaskModal();

  return (
    <Tabs className={'w-full flex-1 rounded-lg border'}>
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
        数据过滤
        <DottedSeparator className={'my-4'} />
        <>
          <TabsContent value={'table'} className={'mt-0'}>
            表格数据
          </TabsContent>
          <TabsContent value={'kanban'} className={'mt-0'}>
            看板数据
          </TabsContent>
          <TabsContent value={'calendar'} className={'mt-0'}>
            日历数据
          </TabsContent>
        </>
      </div>
    </Tabs>
  );
};

export { TaskViewSwitcher };
