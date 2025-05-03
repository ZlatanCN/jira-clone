import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from 'react-icons/go';
import { SettingsIcon, UsersIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const Navigation = () => {
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
        const isActive = false;

        return (
          <Link key={route.href} href={route.href}>
            <div className={cn(
              'flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500',
              isActive && 'bg-white shadow-sm hover:opacity-100 text-primary')
            }>
              {isActive ? <route.icon/> : <route.activeIcon/>}
              {route.label}
            </div>
          </Link>
        );
      })}
    </ul>
  );
};

export { Navigation };