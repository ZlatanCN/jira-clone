'use client';

import { useRouter } from 'next/navigation';
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useConfirm } from '@/hooks/use-confirm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ImageIcon } from 'lucide-react';
import { DottedSeparator } from '@/components/dotted-separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useUpdateProject } from '@/features/projects/api/use-update-project';
import { Project } from '@/features/projects/types';
import { updateProjectSchema } from '@/features/projects/schemas';
import { useDeleteProject } from '@/features/projects/api/use-delete-project';

interface EditProjectFormProps {
  onCancel?: () => void;
  initialValues: Project;
}

const EditProjectForm = ({ onCancel, initialValues }: EditProjectFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useUpdateProject();
  const {
    mutate: deleteProject,
    isPending: isDeletingProject,
  } = useDeleteProject();
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? undefined,
    },
  });
  const [DeleteDialog, confirmDelete] = useConfirm(
    '删除项目',
    '此操作无法撤销',
    'destructive',
  );

  const onSubmit = (values: z.infer<typeof updateProjectSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : '',
    };

    mutate({ form: finalValues, param: { projectId: initialValues.$id } }, {
      onSuccess: () => {
        form.reset();
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

    deleteProject({
      param: { projectId: initialValues.$id },
    }, {
      onSuccess: () => {
        window.location.href = `/workspaces/${initialValues.workspaceId}`;
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
                : () => router.push(
                  `/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`,
                )
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
                      <FormLabel>项目名称</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={'请输入项目名称'}/>
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
              删除一个项目是不可逆操作，并且会清除所有相关数据
            </p>
            <DottedSeparator className={'py-7'}/>
            <Button
              size={'sm'}
              variant={'destructive'}
              type={'button'}
              disabled={isPending || isDeletingProject}
              onClick={handleDelete}
              className={'mt-6 w-fit ml-auto'}
            >
              删除项目
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { EditProjectForm };