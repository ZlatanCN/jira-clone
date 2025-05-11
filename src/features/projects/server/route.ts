import { Hono } from 'hono';
import { sessionMiddleware } from '@/lib/session-middleware';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { getMember } from '@/features/members/utils';
import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID } from '@/config';
import { ID, Query } from 'node-appwrite';
import { createProjectSchema } from '@/features/projects/schemas';

const app = new Hono().post(
  '/',
  zValidator('form', createProjectSchema),
  sessionMiddleware,
  async (c) => {
    const [databases, user, storage] = [
      c.get('databases'),
      c.get('user'),
      c.get('storage')];

    const { name, image, workspaceId } = c.req.valid('form');

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: '未授权' }, 401);
    }

    let uploadedImageUrl: string | undefined;

    if (image instanceof File) {
      const file = await storage.createFile(
        IMAGES_BUCKET_ID,
        ID.unique(),
        image,
      );

      // getFilePreview() 是付费的功能，所以采用其他的方式获取图片
      // const arrayBuffer = await storage.getFilePreview(
      //   IMAGES_BUCKET_ID,
      //   file.$id,
      // );
      //
      // uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).
      //   toString('base64')}`;

      const downloadUrl = await storage.getFileDownload(IMAGES_BUCKET_ID,
        file.$id);
      uploadedImageUrl = `data:image/png;base64,${Buffer.from(downloadUrl).
        toString('base64')}`;
    }

    const project = await databases.createDocument(
      DATABASE_ID,
      PROJECTS_ID,
      ID.unique(),
      {
        name,
        imageUrl: uploadedImageUrl,
        workspaceId,
      },
    );

    return c.json({ data: project });
  },
).get(
  '/',
  sessionMiddleware,
  zValidator('query', z.object({ workspaceId: z.string() })),
  async (c) => {
    const [user, databases] = [c.get('user'), c.get('databases')];
    const { workspaceId } = c.req.valid('query');

    if (!workspaceId) {
      return c.json({ error: '未查询到工作区ID' }, 400);
    }

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: '未授权' }, 401);
    }

    const projects = await databases.listDocuments(
      DATABASE_ID,
      PROJECTS_ID,
      [
        Query.equal('workspaceId', workspaceId),
        Query.orderDesc('$createdAt'),
      ],
    );

    return c.json({ data: projects });
  },
);

export default app;