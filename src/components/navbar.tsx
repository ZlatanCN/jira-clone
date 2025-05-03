import { UserButton } from '@/features/auth/components/user-button';
import { MobileSidebar } from '@/components/mobile-sidebar';

const Navbar = () => {
  return (
    <nav className={'pt-4 px-6 flex items-center justify-between'}>
      <div className={'flex-col hidden lg:flex'}>
        <h1 className={'text-2xl font-semibold'}>主页</h1>
        <p className={'text-muted-foreground'}>在此监控你所有的项目和任务</p>
      </div>
      <MobileSidebar/>
      <UserButton/>
    </nav>
  );
};

export { Navbar };