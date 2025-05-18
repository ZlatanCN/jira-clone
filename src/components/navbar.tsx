'use client';

import { UserButton } from '@/features/auth/components/user-button';
import { MobileSidebar } from '@/components/mobile-sidebar';
import { usePathname } from 'next/navigation';

const pathnameMap = {
  tasks: {
    title: '我的任务',
    description: '在此查看所有任务',
  },
  projects: {
    title: '我的项目',
    description: '在此查看属于此项目的任务',
  },
};

const defaultMap = {
  title: '主页',
  description: '在此监控你所有的项目和任务',
};

const Navbar = () => {
  const pathname = usePathname();
  const pathnameParts = pathname.split('/');
  const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;

  const { title, description } = pathnameMap[pathnameKey] || defaultMap;

  return (
    <nav className={'flex items-center justify-between px-6 pt-4'}>
      <div className={'hidden flex-col lg:flex'}>
        <h1 className={'text-2xl font-semibold'}>{title}</h1>
        <p className={'text-muted-foreground'}>{description}</p>
      </div>
      <MobileSidebar />
      <UserButton />
    </nav>
  );
};

export { Navbar };
