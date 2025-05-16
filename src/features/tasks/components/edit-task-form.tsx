'use client';

import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Button } from '@/components/ui/button';
import React from 'react';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createTaskSchema } from '../schemas';
import { DatePicker } from '@/components/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { Task, TaskStatus } from '../types';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { useUpdateTask } from '@/features/tasks/api/use-update-task';

interface EditTaskFormProps {
  onCancel?: () => void;
  projectOptions: {
    id: string;
    name: string;
    imageUrl: string;
  }[];
  memberOptions: {
    id: string;
    name: string;
  }[];
  initialValues: Task;
}

const EditTaskForm = ({
  onCancel,
  projectOptions,
  memberOptions,
  initialValues,
}: EditTaskFormProps) => {
  const { mutate, isPending } = useUpdateTask();
  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(
      createTaskSchema.omit({ workspaceId: true, description: true }),
    ),
    defaultValues: {
      ...initialValues,
      dueDate: initialValues.dueDate
        ? new Date(initialValues.dueDate)
        : undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof createTaskSchema>) => {
    mutate(
      { json: values, param: { taskId: initialValues.$id } },
      {
        onSuccess: () => {
          form.reset();
          onCancel?.();
        },
      },
    );
  };

  return (
    <Card className={'h-full w-full border-none shadow-none'}>
      <CardHeader className={'flex p-7'}>
        <CardTitle className={'text-xl font-bold'}>编辑一个任务</CardTitle>
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
                    <FormLabel>任务名称</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={'请输入任务名称'} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name={'dueDate'}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>截止日期</FormLabel>
                    <FormControl>
                      <DatePicker {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name={'assigneeId'}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>代理人</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={'选择代理人'} />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        {memberOptions.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            <div className={'flex items-center gap-x-2'}>
                              <MemberAvatar
                                className={'size-6'}
                                name={member.name}
                              />
                              {member.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                name={'status'}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>状态</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={'选择状态'} />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        <SelectItem value={TaskStatus.BACKLOG}>
                          待办列表
                        </SelectItem>
                        <SelectItem value={TaskStatus.IN_PROGRESS}>
                          进行中
                        </SelectItem>
                        <SelectItem value={TaskStatus.IN_REVIEW}>
                          审查中
                        </SelectItem>
                        <SelectItem value={TaskStatus.TODO}>待处理</SelectItem>
                        <SelectItem value={TaskStatus.DONE}>已完成</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                name={'projectId'}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>项目</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={'选择项目'} />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        {projectOptions.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            <div className={'flex items-center gap-x-2'}>
                              <ProjectAvatar
                                className={'size-6'}
                                name={project.name}
                                image={project.imageUrl}
                              />
                              {project.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
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
                保存改变
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export { EditTaskForm };
