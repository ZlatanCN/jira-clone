import React from 'react';
import { getCurrent } from '@/features/auth/queries';
import { redirect } from 'next/navigation';
import { WorkspaceIdClient } from '@/app/(dashboard)/workspaces/[workspaceId]/client';

const WorkspaceIdPage = async () => {
  const user = await getCurrent();

  if (!user) {
    redirect('/sign-in');
  }

  return <WorkspaceIdClient />;
};

export default WorkspaceIdPage;
