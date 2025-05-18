'use client';

import { useCurrent } from '@/features/auth/api/use-current';
import { Loader, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DottedSeparator } from '@/components/dotted-separator';
import { useLogout } from '@/features/auth/api/use-logout';

const UserButton = () => {
  const { data: user, isLoading } = useCurrent();
  const { mutate: logout } = useLogout();

  const avatarFallback = user?.name
    ? user?.name.charAt(0).toUpperCase()
    : (user?.email.charAt(0).toUpperCase() ?? 'U');

  if (isLoading) {
    return (
      <div
        className={
          'flex size-10 items-center justify-center rounded-full border border-neutral-300 bg-neutral-200'
        }
      >
        <Loader className={'size-4 animate-spin text-muted-foreground'} />
      </div>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className={'relative outline-none'}>
        <Avatar
          className={
            'size-10 border border-neutral-300 transition hover:opacity-75'
          }
        >
          <AvatarFallback
            className={
              'flex items-center justify-center bg-neutral-200 font-medium text-neutral-500'
            }
          >
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={'end'}
        side={'bottom'}
        sideOffset={10}
        className={'w-60'}
      >
        <div
          className={
            'flex flex-col items-center justify-center gap-2 px-2.5 py-4'
          }
        >
          <Avatar
            className={'size-[52px] border border-neutral-300 transition'}
          >
            <AvatarFallback
              className={
                'flex items-center justify-center bg-neutral-200 text-xl font-medium text-neutral-500'
              }
            >
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className={'flex flex-col items-center justify-center'}>
            <p className={'text-sm font-medium text-neutral-900'}>
              {user?.name ?? 'User'}
            </p>
            <p className={'text-xs text-neutral-500'}>{user?.email}</p>
          </div>
        </div>
        <DottedSeparator className={'mb-1'} />
        <DropdownMenuItem
          onClick={() => logout()}
          className={
            'flex h-10 cursor-pointer items-center justify-center font-medium text-amber-700'
          }
        >
          <LogOut className={'mr-2 size-4'} />
          登出
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { UserButton };
