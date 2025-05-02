import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DottedSeparator } from "@/components/dotted-separator"
import { FaWeixin } from 'react-icons/fa';
import { SiTencentqq } from 'react-icons/si';
import Link from 'next/link'
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { registerSchema } from '../schemas'
import { useRegister } from '@/features/auth/api/use-register'

const SignUpCard = () => {
  const { mutate } = useRegister()
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })
  const onSubmit = (data: z.infer<typeof registerSchema>) => {
    mutate({ json: data })
  }
  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">
          注册
        </CardTitle>
        <CardDescription>
          注册表明你已经阅读并同意
          <Link href="/terms" className="text-blue-500 ml-1">
            服务条款
          </Link>
          {" "}和
          <Link href="/privacy" className="text-blue-500 ml-1">
            隐私政策
          </Link>
        </CardDescription>
        {/* <CardDescription className="text-sm text-gray-500 mt-2">
          已有账号？
          <Link href="/sign-in" className="text-blue-500 ml-1">
            登录
          </Link>
        </CardDescription> */}
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="请输入用户名"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            >
            </FormField>
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="请输入邮箱"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            >
            </FormField>
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="请输入密码"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            >
            </FormField>
            <Button className="w-full" size="lg" disabled={false}>
              注册
            </Button>
          </form>
        </Form>

      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex flex-col gap-y-4">
        <Button variant="secondary" className="w-full" size="lg" disabled={false}>
          <FaWeixin className="mr-2 size-5" />
          微信
        </Button>
        <Button variant="secondary" className="w-full" size="lg" disabled={false}>
          <SiTencentqq className="mr-2 size-5" />
          QQ
        </Button>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex items-center justify-center text-center">
        <p>
          已有账号？
          <Link href="/sign-in" className="text-blue-500">
            &nbsp;登录
          </Link>
        </p>
      </CardContent>
    </Card>

  )
}

export default SignUpCard