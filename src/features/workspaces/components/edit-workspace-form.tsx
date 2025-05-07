'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateWorkspaceSchema } from '@/features/workspaces/schemas';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DottedSeparator } from '@/components/dotted-separator';
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
import { ArrowLeftIcon, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Workspace } from '@/features/workspaces/types';
import {
  useUpdateWorkspace,
} from '@/features/workspaces/api/use-update-workspace';
import { useConfirm } from '@/hooks/use-confirm';
import {
  useDeleteWorkspace,
} from '@/features/workspaces/api/use-delete-workspace';

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: Workspace;
}

const EditWorkspaceForm = ({
  onCancel,
  initialValues,
}: EditWorkspaceFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useUpdateWorkspace();
  const {
    mutate: deleteWorkspace,
    isPending: isDeletingWorkspace,
  } = useDeleteWorkspace();
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? undefined,
    },
  });
  const [DeleteDialog, confirmDelete] = useConfirm(
    '删除工作区',
    '此操作无法撤销',
    'destructive',
  );

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : '',
    };

    mutate({ form: finalValues, param: { workspaceId: initialValues.$id } }, {
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

  const handleDelete = async () => {
    const ok = await confirmDelete();

    if (!ok) {
      return;
    }

    deleteWorkspace({
      param: { workspaceId: initialValues.$id },
    }, {
      onSuccess: () => {
        window.location.href = '/';
      },
    });
  };

  return (
    <div className={'flex flex-col gap-y-4'}>
      <DeleteDialog/>
      <Card className={'w-full h-full border-none shadow-none'}>
        <CardHeader
          className={'flex flex-row items-center gap-x-4 p-7 space-y-0'}
        >
          <Button
            size={'sm'}
            variant={'secondary'}
            onClick={
              onCancel
                ? onCancel
                : () => router.push(`/workspaces/${initialValues.$id}`)
            }
          >
            <ArrowLeftIcon className={'size-4 mr-2'}/>
            返回
          </Button>
          <CardTitle className={'text-xl font-bold'}>
            {initialValues.name}
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
                  保存修改
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className={'w-full h-full border-none shadow-none'}>
        <CardContent className={'p-7'}>
          <div className={'flex flex-col'}>
            <h3 className={'font-bold'}>危险区域</h3>
            <p className={'text-sm text-muted-foreground'}>
              删除一个工作区是不可逆操作，并且会清除所有相关数据
            </p>
            <Button
              size={'sm'}
              variant={'destructive'}
              type={'button'}
              disabled={isPending || isDeletingWorkspace}
              onClick={handleDelete}
              className={'mt-6 w-fit ml-auto'}
            >
              删除工作区
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { EditWorkspaceForm };