import { Hono } from 'hono';
import { sessionMiddleware } from '@/lib/session-middleware';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { getMember } from '@/features/members/utils';
import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID, TASKS_ID } from '@/config';
import { ID, Query } from 'node-appwrite';
import {
  createProjectSchema,
  updateProjectSchema,
} from '@/features/projects/schemas';
import { Project } from '../types';
import { endOfMonth, startOfMonth, subMonths } from 'date-fns';
import { TaskStatus } from '@/features/tasks/types';

const app = new Hono()
  .post(
    '/',
    zValidator('form', createProjectSchema),
    sessionMiddleware,
    async (c) => {
      const [databases, user, storage] = [
        c.get('databases'),
        c.get('user'),
        c.get('storage'),
      ];

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

        const downloadUrl = await storage.getFileDownload(
          IMAGES_BUCKET_ID,
          file.$id,
        );
        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          downloadUrl,
        ).toString('base64')}`;
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
  )
  .get(
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

      const projects = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        [
          Query.equal('workspaceId', workspaceId),
          Query.orderDesc('$createdAt'),
        ],
      );

      return c.json({ data: projects });
    },
  )
  .get('/:projectId', sessionMiddleware, async (c) => {
    const [databases, user] = [c.get('databases'), c.get('user')];
    const { projectId } = c.req.param();

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId,
    );

    const member = await getMember({
      databases,
      workspaceId: project.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: '未授权' }, 401);
    }

    return c.json({ data: project });
  })
  .patch(
    '/:projectId',
    zValidator('form', updateProjectSchema),
    sessionMiddleware,
    async (c) => {
      const [databases, storage, user] = [
        c.get('databases'),
        c.get('storage'),
        c.get('user'),
      ];

      const { projectId } = c.req.param();
      const { name, image } = c.req.valid('form');

      const existingProject = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId,
      );

      const member = await getMember({
        databases,
        workspaceId: existingProject.workspaceId,
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

        const downloadUrl = await storage.getFileDownload(
          IMAGES_BUCKET_ID,
          file.$id,
        );
        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          downloadUrl,
        ).toString('base64')}`;
      } else {
        uploadedImageUrl = image;
      }

      const project = await databases.updateDocument(
        DATABASE_ID,
        PROJECTS_ID,
        projectId,
        {
          name,
          imageUrl: uploadedImageUrl,
        },
      );

      return c.json({ data: project });
    },
  )
  .delete('/:projectId', sessionMiddleware, async (c) => {
    const [databases, user] = [c.get('databases'), c.get('user')];
    const { projectId } = c.req.param();

    const existingProject = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId,
    );

    const member = await getMember({
      databases,
      workspaceId: existingProject.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: '未授权' }, 401);
    }

    //TODO: 删除所有任务

    await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, projectId);

    return c.json({ data: { $id: existingProject.$id } });
  })
  .get('/:projectId/analytics', sessionMiddleware, async (c) => {
    const [databases, user] = [c.get('databases'), c.get('user')];
    const { projectId } = c.req.param();

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId,
    );

    const member = await getMember({
      databases,
      workspaceId: project.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: '未授权' }, 401);
    }

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const [thisMonthTasks, lastMonthTasks] = await Promise.all([
      databases.listDocuments(DATABASE_ID, TASKS_ID, [
        Query.equal('projectId', projectId),
        Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
        Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
      ]),
      databases.listDocuments(DATABASE_ID, TASKS_ID, [
        Query.equal('projectId', projectId),
        Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
        Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
      ]),
    ]);

    const taskCount = thisMonthTasks.total;
    const taskDifference = taskCount - lastMonthTasks.total;

    const [thisMonthAssignedTasks, lastMonthAssignedTasks] = await Promise.all([
      databases.listDocuments(DATABASE_ID, TASKS_ID, [
        Query.equal('projectId', projectId),
        Query.equal('assigneeId', member.$id),
        Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
        Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
      ]),
      databases.listDocuments(DATABASE_ID, TASKS_ID, [
        Query.equal('projectId', projectId),
        Query.equal('assigneeId', member.$id),
        Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
        Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
      ]),
    ]);

    const assignedTaskCount = thisMonthAssignedTasks.total;
    const assignedTaskDifference =
      assignedTaskCount - lastMonthAssignedTasks.total;

    const [thisMonthInCompleteTasks, lastMonthInCompleteTasks] =
      await Promise.all([
        databases.listDocuments(DATABASE_ID, TASKS_ID, [
          Query.equal('projectId', projectId),
          Query.notEqual('status', TaskStatus.DONE),
          Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
          Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
        ]),
        databases.listDocuments(DATABASE_ID, TASKS_ID, [
          Query.equal('projectId', projectId),
          Query.notEqual('status', TaskStatus.DONE),
          Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
          Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
        ]),
      ]);

    const incompleteTaskCount = thisMonthInCompleteTasks.total;
    const incompleteTaskDifference =
      incompleteTaskCount - lastMonthInCompleteTasks.total;

    const [thisMonthCompletedTasks, lastMonthCompletedTasks] =
      await Promise.all([
        databases.listDocuments(DATABASE_ID, TASKS_ID, [
          Query.equal('projectId', projectId),
          Query.equal('status', TaskStatus.DONE),
          Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
          Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
        ]),
        databases.listDocuments(DATABASE_ID, TASKS_ID, [
          Query.equal('projectId', projectId),
          Query.equal('status', TaskStatus.DONE),
          Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
          Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
        ]),
      ]);

    const completedTaskCount = thisMonthCompletedTasks.total;
    const completedTaskDifference =
      completedTaskCount - lastMonthCompletedTasks.total;

    const [thisMonthOverdueTasks, lastMonthOverdueTasks] = await Promise.all([
      databases.listDocuments(DATABASE_ID, TASKS_ID, [
        Query.equal('projectId', projectId),
        Query.notEqual('status', TaskStatus.DONE),
        Query.lessThan('dueDate', now.toISOString()),
        Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
        Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
      ]),
      databases.listDocuments(DATABASE_ID, TASKS_ID, [
        Query.equal('projectId', projectId),
        Query.notEqual('status', TaskStatus.DONE),
        Query.lessThan('dueDate', now.toISOString()),
        Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
        Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
      ]),
    ]);

    const overdueTaskCount = thisMonthOverdueTasks.total;
    const overdueTaskDifference =
      overdueTaskCount - lastMonthOverdueTasks.total;

    return c.json({
      data: {
        taskCount,
        taskDifference,
        assignedTaskCount,
        assignedTaskDifference,
        incompleteTaskCount,
        incompleteTaskDifference,
        completedTaskCount,
        completedTaskDifference,
        overdueTaskCount,
        overdueTaskDifference,
      },
    });
  });

export default app;
