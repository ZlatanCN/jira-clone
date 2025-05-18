import { ProjectAnalyticsResponseType } from '@/features/projects/api/use-get-project-analytics';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnalyticsCard } from '@/components/analytics-card';

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
        </div>
      </div>
    </ScrollArea>
  );
};

export { Analytics };
