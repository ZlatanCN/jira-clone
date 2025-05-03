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
    : user?.email.charAt(0).toUpperCase()
    ?? 'U';

  if (isLoading) {
    return (
      <div
        className={'flex justify-center items-center size-10 rounded-full bg-neutral-200 border border-neutral-300'}>
        <Loader className={'size-4 animate-spin text-muted-foreground'}/>
      </div>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className={'outline-none relative'}>
        <Avatar
          className={'size-10 hover:opacity-75 transition border border-neutral-300'}>
          <AvatarFallback
            className={'bg-neutral-200 font-medium text-neutral-500 flex justify-center items-center'}>
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={'end'} side={'bottom'} sideOffset={10}
                           className={'w-60'}>
        <div
          className={'flex flex-col justify-center items-center gap-2 px-2.5 py-4'}>
          <Avatar
            className={'size-[52px] transition border border-neutral-300'}>
            <AvatarFallback
              className={'bg-neutral-200 text-xl font-medium text-neutral-500 flex justify-center items-center'}>
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className={'flex flex-col justify-center items-center'}>
            <p className={'text-sm font-medium text-neutral-900'}>
              {user?.name ?? 'User'}
            </p>
            <p className={'text-xs text-neutral-500'}>
              {user?.email}
            </p>
          </div>
        </div>
        <DottedSeparator className={'mb-1'}/>
        <DropdownMenuItem
          onClick={() => logout()}
          className={'h-10 flex justify-center items-center text-amber-700 font-medium cursor-pointer'}
        >
          <LogOut className={'size-4 mr-2'}/>
          登出
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { UserButton };