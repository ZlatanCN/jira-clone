import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ProjectAvatarProps {
  image?: string;
  name: string;
  className?: string;
  fallbackClsssName?: string;
}

export const ProjectAvatar = ({
  image,
  name,
  className,
  fallbackClsssName,
}: ProjectAvatarProps) => {
  if (image) {
    return (
      <div
        className={cn('relative size-5 overflow-hidden rounded-md', className)}
      >
        <Image
          src={image}
          alt={name}
          width={40}
          height={40}
          className={'object-cover'}
        />
      </div>
    );
  }
  return (
    <Avatar className={cn('size-5 rounded-md', className)}>
      <AvatarFallback
        className={cn(
          'rounded-md bg-blue-600 text-sm font-semibold uppercase text-white',
          fallbackClsssName,
        )}
      >
        {name?.[0]}
      </AvatarFallback>
    </Avatar>
  );
};
