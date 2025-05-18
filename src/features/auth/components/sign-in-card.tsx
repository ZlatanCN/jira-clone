'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DottedSeparator } from '@/components/dotted-separator';
// import { FcGoogle } from "react-icons/fc"
// import { SiMicrosoft } from 'react-icons/si';
import { FaWeixin } from 'react-icons/fa';
import { SiTencentqq } from 'react-icons/si';
// import { FaGithub } from "react-icons/fa"
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { loginSchema } from '../schemas';
import { useLogin } from '@/features/auth/api/use-login';

const SignInCard = () => {
  const { mutate, isPending } = useLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    mutate({
      json: values,
    });
  };

  return (
    <Card className={'h-full w-full border-none shadow-none md:w-[487px]'}>
      <CardHeader
        className={'flex items-center justify-center p-7 text-center'}
      >
        <CardTitle className={'text-2xl'}>登录</CardTitle>
      </CardHeader>
      <div className={'px-7'}>
        <DottedSeparator />
      </div>
      <CardContent className={'p-7'}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={'space-y-4'}>
            <FormField
              name={'email'}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={'请输入邮箱'}
                      type={'email'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              name={'password'}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={'请输入密码'}
                      type={'password'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <Button className={'w-full'} size={'lg'} disabled={isPending}>
              登录
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className={'px-7'}>
        <DottedSeparator />
      </div>
      <CardContent className={'flex flex-col gap-y-4 p-7'}>
        <Button
          variant={'secondary'}
          className={'w-full'}
          size={'lg'}
          disabled={isPending}
        >
          <FaWeixin className={'mr-2 size-5'} />
          微信
        </Button>
        <Button
          variant={'secondary'}
          className={'w-full'}
          size={'lg'}
          disabled={isPending}
        >
          <SiTencentqq className={'mr-2 size-5'} />
          QQ
        </Button>
      </CardContent>
      <div className={'px-7'}>
        <DottedSeparator />
      </div>
      <CardContent
        className={'flex items-center justify-center p-7 text-center'}
      >
        <p>
          还没有账号？
          <Link href={'/sign-up'} className={'text-blue-500'}>
            &nbsp;注册
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignInCard;
