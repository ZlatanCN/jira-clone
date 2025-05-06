import React from 'react';
import { getCurrent } from '@/features/auth/actions';
import { redirect } from 'next/navigation';

const WorkspaceIdPage = async () => {
  const user = await getCurrent();
  
  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div>工作区页面</div>
  );
};

export default WorkspaceIdPage;