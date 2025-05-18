'use client';

import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useGetWorkspaceAnalytics } from '@/features/workspaces/api/use-get-workspace-analytics';
import { useGetTasks } from '@/features/tasks/api/use-get-tasks';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useCreateProjectModal } from '@/features/projects/hooks/use-create-project-modal';
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal';
import { PageLoader } from '@/components/page-loader';
import { PageError } from '@/components/page-error';
import { Analytics } from '@/components/analytics';
import { Task } from '@/features/tasks/types';
import { Button } from '@/components/ui/button';
import { CalendarIcon, PlusIcon, Settings } from 'lucide-react';
import { DottedSeparator } from '@/components/dotted-separator';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Project } from '@/features/projects/types';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { Member } from '@/features/members/types';
import { MemberAvatar } from '@/features/members/components/member-avatar';

interface TaskListProps {
  data: Task[];
  total: number;
}

interface ProjectListProps {
  data: Project[];
  total: number;
}

interface MemberListProps {
  data: Member[];
  total: number;
}

const TaskList = ({ data, total }: TaskListProps) => {
  const { open: createTask } = useCreateTaskModal();
  const workspaceId = useWorkspaceId();

  return (
    <div className={'col-span-1 flex flex-col gap-y-4'}>
      <div className={'rounded-lg bg-muted p-4'}>
        <div className={'flex items-center justify-between'}>
          <p className={'text-lg font-semibold'}>任务 ({total})</p>
          <Button variant={'muted'} size={'icon'} onClick={createTask}>
            <PlusIcon className={'size-4 text-neutral-400'} />
          </Button>
        </div>
        <DottedSeparator className={'my-4'} />
        <ul className={'flex flex-col gap-y-4'}>
          {data.map((task) => (
            <li key={task.$id}>
              <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                <Card
                  className={
                    'rounded-lg shadow-none transition hover:opacity-75'
                  }
                >
                  <CardContent className={'p-4'}>
                    <p className={'truncate text-lg font-medium'}>
                      {task.name}
                    </p>
                    <div className={'flex items-center gap-x-2'}>
                      <p>{task.project?.name}</p>
                      <div className={'size-1 rounded-full bg-neutral-300'} />
                      <div
                        className={
                          'flex items-center text-sm text-muted-foreground'
                        }
                      >
                        <CalendarIcon className={'mr-1 size-3'} />
                        <span className={'truncate'}>
                          {formatDistanceToNow(new Date(task.dueDate))}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li
            className={
              'hidden text-center text-sm text-muted-foreground first-of-type:block'
            }
          >
            没有更多任务了
          </li>
        </ul>
        <Button variant={'muted'} asChild={true} className={'mt-4 w-full'}>
          <Link href={`/workspaces/${workspaceId}/tasks`}>查看更多</Link>
        </Button>
      </div>
    </div>
  );
};

const ProjectList = ({ data, total }: ProjectListProps) => {
  const { open: createProject } = useCreateProjectModal();
  const workspaceId = useWorkspaceId();

  return (
    <div className={'col-span-1 flex flex-col gap-y-4'}>
      <div className={'rounded-lg border bg-white p-4'}>
        <div className={'flex items-center justify-between'}>
          <p className={'text-lg font-semibold'}>项目 ({total})</p>
          <Button variant={'secondary'} size={'icon'} onClick={createProject}>
            <PlusIcon className={'size-4 text-neutral-400'} />
          </Button>
        </div>
        <DottedSeparator className={'my-4'} />
        <ul className={'grid grid-cols-1 gap-4 lg:grid-cols-2'}>
          {data.map((project) => (
            <li key={project.$id}>
              <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                <Card
                  className={
                    'rounded-lg shadow-none transition hover:opacity-75'
                  }
                >
                  <CardContent className={'flex items-center gap-x-2.5 p-4'}>
                    <ProjectAvatar
                      name={project.name}
                      image={project.imageUrl}
                      fallbackClsssName={'text-lg'}
                      className={'size-12'}
                    />
                    <p className={'truncate text-lg font-medium'}>
                      {project.name}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li
            className={
              'hidden text-center text-sm text-muted-foreground first-of-type:block'
            }
          >
            没有更多项目了
          </li>
        </ul>
      </div>
    </div>
  );
};

const MemberList = ({ data, total }: MemberListProps) => {
  const workspaceId = useWorkspaceId();

  return (
    <div className={'col-span-1 flex flex-col gap-y-4'}>
      <div className={'rounded-lg border bg-white p-4'}>
        <div className={'flex items-center justify-between'}>
          <p className={'text-lg font-semibold'}>成员 ({total})</p>
          <Button variant={'secondary'} size={'icon'} asChild={true}>
            <Link href={`/workspaces/${workspaceId}/members`}>
              <Settings className={'size-4 text-neutral-400'} />
            </Link>
          </Button>
        </div>
        <DottedSeparator className={'my-4'} />
        <ul className={'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'}>
          {data.map((member) => (
            <li key={member.$id}>
              <Card className={'overflow-hidden rounded-lg shadow-none'}>
                <CardContent
                  className={'flex flex-col items-center gap-x-2 p-3'}
                >
                  <MemberAvatar name={member.name} className={'size-12'} />
                  <div className={'flex flex-col items-center overflow-hidden'}>
                    <p className={'line-clamp-1 text-lg font-medium'}>
                      {member.name}
                    </p>
                    <p className={'line-clamp-1 text-sm text-muted-foreground'}>
                      {member.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
          <li
            className={
              'hidden text-center text-sm text-muted-foreground first-of-type:block'
            }
          >
            没有更多成员了
          </li>
        </ul>
      </div>
    </div>
  );
};

const WorkspaceIdClient = () => {
  const workspaceId = useWorkspaceId();
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetWorkspaceAnalytics({ workspaceId });
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
  });
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const isLoading =
    isLoadingAnalytics ||
    isLoadingTasks ||
    isLoadingProjects ||
    isLoadingMembers;

  if (isLoading) {
    return <PageLoader />;
  }

  if (!analytics || !tasks || !projects || !members) {
    return <PageError message={'获取工作区数据失败'} />;
  }

  return (
    <div className={'flex h-full flex-col space-y-4'}>
      <Analytics data={analytics} />
      <div className={'grid grid-cols-1 gap-4 xl:grid-cols-2'}>
        <TaskList data={tasks.documents} total={tasks.total} />
        <ProjectList data={projects.documents} total={projects.total} />
        <MemberList data={members.documents} total={members.total} />
      </div>
    </div>
  );
};

export { WorkspaceIdClient, TaskList };
