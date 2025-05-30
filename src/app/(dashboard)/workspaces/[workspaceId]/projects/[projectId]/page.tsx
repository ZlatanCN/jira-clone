import { redirect } from 'next/navigation';
import { getCurrent } from '@/features/auth/queries';
import { ProjectIdClient } from '@/app/(dashboard)/workspaces/[workspaceId]/projects/[projectId]/client';

const ProjectIdPage = async () => {
  const user = await getCurrent();
  if (!user) redirect('/sign-in');

  return <ProjectIdClient />;
};

export default ProjectIdPage;
