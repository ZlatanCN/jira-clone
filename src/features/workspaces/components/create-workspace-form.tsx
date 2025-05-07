'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createWorkspaceSchema } from '@/features/workspaces/schemas';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DottedSeparator } from '@/components/dotted-separator';
import {
  useCreateWorkspace,
} from '@/features/workspaces/api/use-create-workspace';
import { useRouter } from 'next/navigation';
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

interface CreateWorkspaceFormProps {
  onCancel?: () => void;
}

const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useCreateWorkspace();
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: '',
      image: '',
    },
  });

  const onSubmit = (values: z.infer<typeof createWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : '',
    };

    mutate({ form: finalValues }, {
      onSuccess: ({ data }) => {
        form.reset();
        router.push(`/workspaces/${data.$id}`);
      },
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      form.setValue('image', file);
    }
  };

  return (
    <Card className={'w-full h-full border-none shadow-none'}>
      <CardHeader className={'flex p-7'}>
        <CardTitle className={'text-xl font-bold'}>
          创建一个新的工作区
        </CardTitle>
      </CardHeader>
      <div className={'px-7'}>
        <DottedSeparator/>
      </div>
      <CardContent className={'p-7'}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className={'flex flex-col gap-y-4'}>
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>工作区名称</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={'请输入工作区名称'}/>
                    </FormControl>
                    <FormMessage/>
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
                          className={'size-[72px] relative rounded-md overflow-hidden'}
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
                        <p className={'text-sm'}>工作区图标</p>
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
                            className={'w-fit mt-2'}
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
                            className={'w-fit mt-2'}
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
            <DottedSeparator className={'py-7'}/>
            <div className={'flex justify-between items-center'}>
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
                创建工作区
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export { CreateWorkspaceForm };