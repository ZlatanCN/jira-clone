'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useJoinWorkspace } from '@/features/workspaces/api/use-join-workspace';
import { useInviteCode } from '@/features/workspaces/hooks/use-invite-code';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useRouter } from 'next/navigation';

interface JoinWorkspaceFormProps {
  initialValues: {
    name: string
  };
}

const JoinWorkspaceForm = ({ initialValues }: JoinWorkspaceFormProps) => {
  const { mutate, isPending } = useJoinWorkspace();
  const inviteCode = useInviteCode();
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const onSubmit = () => {
    mutate({
      param: { workspaceId },
      json: { code: inviteCode },
    }, {
      onSuccess: ({ data }) => {
        router.push(`/workspaces/${data.$id}`);
      },
    });
  };

  return (
    <Card className={'w-full h-full border-none shadow-none'}>
      <CardHeader className={'p-7'}>
        <CardTitle className={'text-xl font-bold'}>
          加入工作区
        </CardTitle>
        <CardDescription>
          您已被邀请加入<strong>{initialValues.name}</strong>工作区
        </CardDescription>
      </CardHeader>
      <div className={'px-7'}>
        <DottedSeparator/>
      </div>
      <CardContent className={'p-7'}>
        <div
          className={'flex flex-col lg:flex-row gap-2 items-center justify-between'}
        >
          <Button
            size={'lg'}
            type={'button'}
            variant={'secondary'}
            asChild={true}
            disabled={isPending}
            className={'w-full lg:w-fit'}
          >
            <Link href={'/'}>
              取消
            </Link>
          </Button>
          <Button
            size={'lg'}
            type={'button'}
            onClick={onSubmit}
            disabled={isPending}
            className={'w-full lg:w-fit'}
          >
            加入工作区
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { JoinWorkspaceForm };