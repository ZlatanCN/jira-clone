import { z } from 'zod';
import { TaskStatus } from '@/features/tasks/types';

const createTaskSchema = z.object({
  name: z.string().trim().min(1, '必填项'),
  status: z.nativeEnum(TaskStatus, { required_error: '必填项' }),
  workspaceId: z.string().trim().min(1, '必填项').optional(),
  projectId: z.string().trim().min(1, '必填项'),
  dueDate: z.coerce.date(),
  assigneeId: z.string().trim().min(1, '必填项'),
  description: z.string().trim().optional(),
});

export { createTaskSchema };
