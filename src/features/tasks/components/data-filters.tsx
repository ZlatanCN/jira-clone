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
import { ListCheckIcon } from 'lucide-react';
import { TaskStatus } from '@/features/tasks/types';

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

  const onStatusChange = (value: string) => {
    if (value === 'all') {
      setFilters({ status: null });
    } else {
      setFilters({ status: value as TaskStatus });
    }
  };

  if (isLoading) return null;
  return (
    <div className="flex flex-col gap-2 lg:flex-row">
      <Select defaultValue={undefined} onValueChange={() => {}}>
        <SelectTrigger className="h-8 w-full lg:w-auto">
          <div className="flex items-center pr-2">
            <ListCheckIcon className="mr-2 size-4" />
            <SelectValue placeholder="All statuses" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">所有状态</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.BACKLOG}>待办列表</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export { DataFilters };
