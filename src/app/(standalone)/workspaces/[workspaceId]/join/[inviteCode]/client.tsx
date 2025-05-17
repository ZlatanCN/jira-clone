'use client';

import { JoinWorkspaceForm } from '@/features/workspaces/components/join-workspace-form';
import { PageLoader } from '@/components/page-loader';
import { PageError } from '@/components/page-error';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useGetWorkspaceInfo } from '@/features/workspaces/api/use-get-workspace-info';

const WorkspaceIdJoinClient = () => {
  const workspaceId = useWorkspaceId();
  const { data: initialValues, isLoading } = useGetWorkspaceInfo({
    workspaceId,
  });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!initialValues) {
    return <PageError message={'工作区不存在'} />;
  }

  return (
    <div className={'w-full lg:max-w-xl'}>
      <JoinWorkspaceForm initialValues={initialValues} />
    </div>
  );
};

export { WorkspaceIdJoinClient };
