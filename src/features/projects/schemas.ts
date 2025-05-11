import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, '必填项'),
  image: z.union([
    z.instanceof(File),
    z.string().transform((value) => value === '' ? undefined : value),
  ]).optional(),
  workspaceId: z.string().optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(1, '至少需要一个字符').optional(),
  image: z.union([
    z.instanceof(File),
    z.string().transform((value) => value === '' ? undefined : value),
  ]).optional(),
});
