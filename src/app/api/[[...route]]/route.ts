import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import auth from '@/features/auth/server/route';
import workspaces from '@/features/workspaces/server/route';

const runtime = 'edge';

const app = new Hono().basePath('/api');

const routes = app.route('/auth', auth).route('/workspaces', workspaces);

const GET = handle(app);
const POST = handle(app);

type AppType = typeof routes

export { GET, POST, runtime };
export type { AppType };