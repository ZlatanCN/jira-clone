import Image from "next/image";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
      <div className={cn(
        "size-5 relative rounded-md overflow-hidden",
        className
      )}>
        <Image
          src={image}
          alt={name}
          width={40}
          height={40}
          className="object-cover"
        />
      </div>
    );
  }
  return (
    <Avatar className={cn("size-5 rounded-md", className)}>
      <AvatarFallback className={cn("text-white rounded-md bg-blue-600 font-semibold text-sm uppercase", fallbackClsssName)}>
        {name?.[0]}
      </AvatarFallback>
    </Avatar>
  );
}