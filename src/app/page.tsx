'use client';

import { useRouter } from 'next/navigation';
import { useCurrent } from '@/features/auth/api/use-current';
import { useEffect } from 'react';
import { useLogout } from '@/features/auth/api/use-logout';
import { Button } from '@/components/ui/button';

export default function Home () {
  const router = useRouter();
  const { data, isLoading } = useCurrent();
  const { mutate } = useLogout();

  useEffect(() => {
    if (!data && !isLoading) {
      router.push('/sign-in');
    }
  }, [data]);

  return (
    <div>
      只有通过鉴权的用户才能看到这个页面
      <Button onClick={() => mutate()}>Logout</Button>
    </div>
  );
}