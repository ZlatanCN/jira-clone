'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';
import { Sidebar } from '@/components/sidebar';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild={true}>
        <Button variant={'secondary'} className={'lg:hidden'}>
          <MenuIcon className={'size-4 text-neutral-500'} />
        </Button>
      </SheetTrigger>
      <SheetContent side={'left'} className={'p-0'}>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};

export { MobileSidebar };
