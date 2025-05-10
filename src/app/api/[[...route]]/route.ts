import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import auth from '@/features/auth/server/route';
import workspaces from '@/features/workspaces/server/route';
import members from '@/features/members/server/route';
import projects from '@/features/projects/server/route';

const runtime = 'edge';

const app = new Hono().basePath('/api');

const routes = app.route('/auth', auth).
  route('/workspaces', workspaces).
  route('/members', members).
  route('/projects', projects);

const GET = handle(app);
const POST = handle(app);
const PATCH = handle(app);
const DELETE = handle(app);

type AppType = typeof routes

export { GET, POST, PATCH, DELETE, runtime };
export type { AppType };