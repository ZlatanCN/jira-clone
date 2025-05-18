'use client';

import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces';
import { RiAddCircleFill } from 'react-icons/ri';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WorkspaceAvatar } from '@/features/workspaces/components/workspace-avatar';
import { useRouter } from 'next/navigation';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useCreateWorkspaceModal } from '@/features/workspaces/hooks/use-create-workspace-modal';

export const WorkspaceSwitcher = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { data: workspaces } = useGetWorkspaces();
  const { open } = useCreateWorkspaceModal();

  const onSelect = (id: string) => {
    router.push(`/workspaces/${id}`);
  };

  return (
    <div className={'flex flex-col gap-y-2'}>
      <div className={'flex items-center justify-between'}>
        <p className={'text-xl text-neutral-500'}>工作区</p>
        <RiAddCircleFill
          onClick={open}
          className={
            'size-5 cursor-pointer text-neutral-500 transition hover:opacity-75'
          }
        />
      </div>
      <Select onValueChange={onSelect} value={workspaceId}>
        <SelectTrigger className={'w-full bg-neutral-200 p-1 font-medium'}>
          <SelectValue placeholder={'未选择工作区'} />
        </SelectTrigger>
        <SelectContent>
          {workspaces?.documents.map((workspace) => (
            <SelectItem key={workspace.$id} value={workspace.$id}>
              <div
                className={'flex items-center justify-start gap-3 font-medium'}
              >
                <WorkspaceAvatar
                  image={workspace.imageUrl}
                  name={workspace.name}
                />
                <span className={'truncate'}>{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
