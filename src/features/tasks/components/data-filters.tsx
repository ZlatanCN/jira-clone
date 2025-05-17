import React from 'react';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { useGetMembers } from '@/features/members/api/use-get-members';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FolderIcon, ListCheckIcon, UserIcon } from 'lucide-react';
import { TaskStatus } from '@/features/tasks/types';
import { useTaskFilters } from '@/features/tasks/hooks/use-task-filters';
import { DatePicker } from '@/components/date-picker';

interface DataFiltersProps {
  hideProjectFilter?: boolean;
}

const DataFilters = ({ hideProjectFilter }: DataFiltersProps) => {
  const workspaceId = useWorkspaceId();
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });
  const isLoading = isLoadingProjects || isLoadingMembers;

  const projectOptions = projects?.documents.map((project) => ({
    value: project.$id,
    label: project.name,
  }));

  const memberOptions = members?.documents.map((member) => ({
    value: member.$id,
    label: member.name,
  }));

  const [{ status, assigneeId, projectId, dueDate }, setFilters] =
    useTaskFilters();

  const onStatusChange = async (value: string) => {
    console.log('status', value);
    await setFilters({ status: value == 'all' ? null : (value as TaskStatus) });
  };

  const onAssigneeChange = async (value: string) => {
    console.log('assigneeId', value);
    await setFilters({ assigneeId: value == 'all' ? null : (value as string) });
  };

  const onProjectChange = async (value: string) => {
    console.log('projectId', value);
    await setFilters({ projectId: value == 'all' ? null : (value as string) });
  };

  if (isLoading) return null;

  return (
    <div className={'flex flex-col gap-2 lg:flex-row'}>
      <Select
        defaultValue={status ?? undefined}
        onValueChange={(value) => onStatusChange(value)}
      >
        <SelectTrigger className={'h-8 w-full lg:w-auto'}>
          <div className={'flex items-center pr-2'}>
            <ListCheckIcon className={'mr-2 size-4'} />
            <SelectValue placeholder={'所有状态'} />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={'all'}>所有状态</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.BACKLOG}>待办</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>进行中</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>审核中</SelectItem>
          <SelectItem value={TaskStatus.TODO}>未完成</SelectItem>
          <SelectItem value={TaskStatus.DONE}>已完成</SelectItem>
        </SelectContent>
      </Select>
      <Select
        defaultValue={assigneeId ?? undefined}
        onValueChange={(value) => onAssigneeChange(value)}
      >
        <SelectTrigger className={'h-8 w-full lg:w-auto'}>
          <div className={'flex items-center pr-2'}>
            <UserIcon className={'mr-2 size-4'} />
            <SelectValue placeholder={'所有代理人'} />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={'all'}>所有代理人</SelectItem>
          <SelectSeparator />
          {memberOptions?.map((member) => (
            <SelectItem key={member.value} value={member.value}>
              {member.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!hideProjectFilter && (
        <Select
          defaultValue={projectId ?? undefined}
          onValueChange={(value) => onProjectChange(value)}
        >
          <SelectTrigger className={'h-8 w-full lg:w-auto'}>
            <div className={'flex items-center pr-2'}>
              <FolderIcon className={'mr-2 size-4'} />
              <SelectValue placeholder={'所有项目'} />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={'all'}>所有项目</SelectItem>
            <SelectSeparator />
            {projectOptions?.map((project) => (
              <SelectItem key={project.value} value={project.value}>
                {project.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <DatePicker
        placeholder={'截止日期'}
        className={'h-8 w-full lg:w-auto'}
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={async (date) => {
          await setFilters({ dueDate: date ? date.toISOString() : null });
        }}
      />
    </div>
  );
};

export { DataFilters };
