'use client';

import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from 'react-icons/go';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { usePathname } from 'next/navigation';
import { SettingsIcon, UsersIcon } from 'lucide-react';

const Navigation = () => {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();

  const routes = [
    {
      label: '主页',
      href: '',
      icon: GoHome,
      activeIcon: GoHomeFill,
    },
    {
      label: '我的任务',
      href: '/tasks',
      icon: GoCheckCircle,
      activeIcon: GoCheckCircleFill,
    },
    {
      label: '设置',
      href: '/settings',
      icon: SettingsIcon,
      activeIcon: SettingsIcon,
    },
    {
      label: '成员',
      href: '/members',
      icon: UsersIcon,
      activeIcon: UsersIcon,
    },
  ];

  return (
    <ul className={'flex flex-col'}>
      {routes.map((route) => {
        const fullHref = `/workspaces/${workspaceId}${route.href}`;
        const isActive = pathname === fullHref;

        return (
          <Link key={route.href} href={fullHref}>
            <div className={cn(
              'flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500',
              isActive && 'bg-white shadow-sm hover:opacity-100 text-primary')
            }>
              {isActive
                ? <route.activeIcon className={'size-5 text-neutral-500'}/>
                : <route.icon className={'size-5 text-neutral-500'}/>}
              {route.label}
            </div>
          </Link>
        );
      })}
    </ul>
  );
};

export { Navigation };