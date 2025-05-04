import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, '请输入密码'),
});

const registerSchema = z.object({
  name: z.string().trim().min(1, '请输入用户名'),
  email: z.string().email('邮箱格式错误'),
  password: z.string().min(8, '长度不能少于8位').max(16, '长度不能大于16位'),
});

export { loginSchema, registerSchema };