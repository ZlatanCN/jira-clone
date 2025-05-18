import { z } from 'zod';

const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, '必填项'),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === '' ? undefined : value)),
    ])
    .optional(),
});

const updateWorkspaceSchema = z.object({
  name: z.string().trim().min(1, '必须有至少一位角色').optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === '' ? undefined : value)),
    ])
    .optional(),
});

export { createWorkspaceSchema, updateWorkspaceSchema };
