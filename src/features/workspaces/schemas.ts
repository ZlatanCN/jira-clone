import { z } from 'zod';

const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, '必填项'),
});

export { createWorkspaceSchema };