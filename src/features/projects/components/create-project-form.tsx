'use client';

import { createProjectSchema } from '@/features/projects/schemas';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DottedSeparator } from '@/components/dotted-separator';
import { useCreateProject } from '@/features/projects/api/use-create-project';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React, { useRef } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

interface CreateProjectFormProps {
  onCancel?: () => void;
}

const CreateProjectForm = ({ onCancel }: CreateProjectFormProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { mutate, isPending } = useCreateProject();
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(
      createProjectSchema.omit({ workspaceId: true }),
    ) as never,
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = (values: z.infer<typeof createProjectSchema>) => {
    const finalValues = {
      ...values,
      workspaceId,
      image: values.image instanceof File ? values.image : '',
    };

    mutate(
      { form: finalValues },
      {
        onSuccess: ({ data }) => {
          form.reset();
          router.push(`/workspaces/${workspaceId}/projects/${data.$id}`);
        },
      },
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      form.setValue('image', file);
    }
  };

  return (
    <Card className={'h-full w-full border-none shadow-none'}>
      <CardHeader className={'flex p-7'}>
        <CardTitle className={'text-xl font-bold'}>创建一个新的项目</CardTitle>
      </CardHeader>
      <div className={'px-7'}>
        <DottedSeparator />
      </div>
      <CardContent className={'p-7'}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className={'flex flex-col gap-y-4'}>
              <FormField
                name={'name'}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>项目名称</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={'请输入项目名称'} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={'image'}
                render={({ field }) => (
                  <div className={'flex flex-col gap-y-2'}>
                    <div className={'flex items-center gap-x-5'}>
                      {field.value ? (
                        <div
                          className={
                            'relative size-[72px] overflow-hidden rounded-md'
                          }
                        >
                          <Image
                            src={
                              field.value instanceof File
                                ? URL.createObjectURL(field.value)
                                : field.value
                            }
                            alt={'logo'}
                            fill={true}
                            className={'object-cover'}
                          />
                        </div>
                      ) : (
                        <Avatar className={'size-[72px]'}>
                          <AvatarFallback>
                            <ImageIcon
                              className={'size-[36px] text-neutral-400'}
                            />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className={'flex flex-col'}>
                        <p className={'text-sm'}>项目图标</p>
                        <p className={'text-sm text-muted-foreground'}>
                          JPG、PNG、SVG 或 JPEG，最大 1MB
                        </p>
                        <input
                          accept={'.jpg, .png, .svg, .jpeg'}
                          type={'file'}
                          ref={inputRef}
                          disabled={isPending}
                          onChange={handleImageChange}
                          className={'hidden'}
                        />
                        {field.value ? (
                          <Button
                            type={'button'}
                            size={'xs'}
                            variant={'destructive'}
                            disabled={isPending}
                            onClick={() => {
                              field.onChange(null);
                              if (inputRef.current) {
                                inputRef.current.value = '';
                              }
                            }}
                            className={'mt-2 w-fit'}
                          >
                            移除图标
                          </Button>
                        ) : (
                          <Button
                            type={'button'}
                            size={'xs'}
                            variant={'teritary'}
                            disabled={isPending}
                            onClick={() => inputRef.current?.click()}
                            className={'mt-2 w-fit'}
                          >
                            上传图标
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
            <DottedSeparator className={'py-7'} />
            <div className={'flex items-center justify-between'}>
              <Button
                type={'button'}
                size={'lg'}
                variant={'secondary'}
                onClick={onCancel}
                disabled={isPending}
                className={cn(!onCancel && 'invisible')}
              >
                取消
              </Button>
              <Button
                type={'submit'}
                size={'lg'}
                variant={'primary'}
                disabled={isPending}
              >
                创建项目
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export { CreateProjectForm };
