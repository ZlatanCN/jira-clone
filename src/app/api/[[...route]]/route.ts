import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import auth from '@/features/auth/server/route';
import workspaces from '@/features/workspaces/server/route';
import members from '@/features/members/server/route';
import projects from '@/features/projects/server/route';
import tasks from '@/features/tasks/server/route';

const app = new Hono()
  .basePath('/api')
  .route('/auth', auth)
  .route('/workspaces', workspaces)
  .route('/members', members)
  .route('/projects', projects)
  .route('/tasks', tasks);

const GET = handle(app);
const POST = handle(app);
const PATCH = handle(app);
const DELETE = handle(app);

type AppType = typeof app;

export const runtime = 'edge';
export { GET, POST, PATCH, DELETE };
export type { AppType };
