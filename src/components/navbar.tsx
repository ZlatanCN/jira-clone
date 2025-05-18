import { UserButton } from '@/features/auth/components/user-button';
import { MobileSidebar } from '@/components/mobile-sidebar';

const Navbar = () => {
  return (
    <nav className={'flex items-center justify-between px-6 pt-4'}>
      <div className={'hidden flex-col lg:flex'}>
        <h1 className={'text-2xl font-semibold'}>主页</h1>
        <p className={'text-muted-foreground'}>在此监控你所有的项目和任务</p>
      </div>
      <MobileSidebar />
      <UserButton />
    </nav>
  );
};

export { Navbar };
