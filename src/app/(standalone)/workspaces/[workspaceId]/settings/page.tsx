import { getCurrent } from '@/features/auth/actions';
import { redirect } from 'next/navigation';
import {
  EditWorkspaceForm,
} from '@/features/workspaces/components/edit-workspace-form';

interface WorkspaceIdSettingsPageProps {
  params: {
    workspaceId: string;
  };
}

const WorkspaceIdSettingsPage = async ({ params }: WorkspaceIdSettingsPageProps) => {
  const user = await getCurrent();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div>
      <EditWorkspaceForm/>
    </div>
  );
};

export default WorkspaceIdSettingsPage;