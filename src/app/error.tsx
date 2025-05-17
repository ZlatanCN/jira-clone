'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const ErrorPage = () => {
  return (
    <div
      className={'flex h-screen flex-col items-center justify-center gap-y-4'}
    >
      <AlertTriangle className={'size-6'} />
      <p className={'text-sm'}>出现错误</p>
      <Button variant={'secondary'} size={'sm'}>
        <Link href={'/'}>返回首页</Link>
      </Button>
    </div>
  );
};
export default ErrorPage;
