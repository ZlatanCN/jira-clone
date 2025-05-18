import { ProjectAnalyticsResponseType } from '@/features/projects/api/use-get-project-analytics';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { AnalyticsCard } from '@/components/analytics-card';
import { DottedSeparator } from '@/components/dotted-separator';

const Analytics = ({ data }: ProjectAnalyticsResponseType) => {
  return (
    <ScrollArea
      className={'w-full shrink-0 whitespace-nowrap rounded-lg border'}
    >
      <div className={'flex w-full flex-row'}>
        <div className={'flex flex-1 items-center'}>
          <AnalyticsCard
            title={'全部任务'}
            value={data.taskCount}
            variant={data.taskDifference > 0 ? 'up' : 'down'}
            increaseValue={data.taskDifference}
          />
          <DottedSeparator direction={'vertical'} />
        </div>
        <div className={'flex flex-1 items-center'}>
          <AnalyticsCard
            title={'分配的任务'}
            value={data.assignedTaskCount}
            variant={data.assignedTaskDifference > 0 ? 'up' : 'down'}
            increaseValue={data.assignedTaskDifference}
          />
          <DottedSeparator direction={'vertical'} />
        </div>
        <div className={'flex flex-1 items-center'}>
          <AnalyticsCard
            title={'完成的任务'}
            value={data.completedTaskCount}
            variant={data.completedTaskDifference > 0 ? 'up' : 'down'}
            increaseValue={data.completedTaskDifference}
          />
          <DottedSeparator direction={'vertical'} />
        </div>
        <div className={'flex flex-1 items-center'}>
          <AnalyticsCard
            title={'超时的任务'}
            value={data.overdueTaskCount}
            variant={data.overdueTaskDifference > 0 ? 'up' : 'down'}
            increaseValue={data.overdueTaskDifference}
          />
          <DottedSeparator direction={'vertical'} />
        </div>
        <div className={'flex flex-1 items-center'}>
          <AnalyticsCard
            title={'未完成的任务'}
            value={data.incompleteTaskCount}
            variant={data.incompleteTaskDifference > 0 ? 'up' : 'down'}
            increaseValue={data.incompleteTaskDifference}
          />
        </div>
      </div>
      <ScrollBar orientation={'horizontal'} />
    </ScrollArea>
  );
};

export { Analytics };
