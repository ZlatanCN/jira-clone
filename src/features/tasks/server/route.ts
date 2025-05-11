import { Hono } from 'hono';
import { sessionMiddleware } from '@/lib/session-middleware';
import { zValidator } from '@hono/zod-validator';
import { createTaskSchema } from '@/features/tasks/schemas';
import { getMember } from '@/features/members/utils';
import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from '@/config';
import { ID, Query } from 'node-appwrite';
import { z } from 'zod';
import { TaskStatus } from '@/features/tasks/types';
import { createAdminClient } from '@/lib/appwrite';
import { Project } from '@/features/projects/types';

const app = new Hono()
  .get(
    '/',
    sessionMiddleware,
    zValidator(
      'query',
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        status: z.nativeEnum(TaskStatus).nullish(),
        search: z.string().nullish(),
        dueDate: z.string().nullish(),
      }),
    ),
    async (c) => {
      const { users } = await createAdminClient();
      const [user, databases] = [c.get('user'), c.get('databases')];
      const { workspaceId, assigneeId, dueDate, search, status, projectId } =
        c.req.valid('query');

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: '未授权' }, 401);
      }

      const query = [
        Query.equal('workspaceId', workspaceId),
        Query.orderDesc('$createdAt'),
      ];

      if (projectId) {
        console.log('projectId', projectId);
        query.push(Query.equal('projectId', projectId));
      }

      if (status) {
        console.log('status', status);
        query.push(Query.equal('status', status));
      }

      if (assigneeId) {
        console.log('assigneeId', assigneeId);
        query.push(Query.equal('assigneeId', assigneeId));
      }

      if (dueDate) {
        console.log('dueDate', dueDate);
        query.push(Query.equal('dueDate', dueDate));
      }

      if (search) {
        console.log('search', search);
        query.push(Query.search('name', search));
      }

      const tasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, query);

      const [projectIds, assigneeIds] = tasks.documents.map((task) => [
        task.projectId,
        task.assigneeId,
      ]);

      const [projects, members] = [
        await databases.listDocuments<Project>(
          DATABASE_ID,
          PROJECTS_ID,
          projectIds.length > 0 ? [Query.contains('$id', projectIds)] : [],
        ),
        await databases.listDocuments(
          DATABASE_ID,
          MEMBERS_ID,
          assigneeIds.length > 0 ? [Query.contains('$id', assigneeIds)] : [],
        ),
      ];

      const assignees = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);

          return {
            ...member,
            name: user.name,
            email: user.email,
          };
        }),
      );

      const populatedTasks = tasks.documents.map((task) => {
        const [project, assignee] = [
          projects.documents.find((project) => project.$id === task.projectId),
          assignees.find((assignee) => assignee.$id === task.assigneeId),
        ];

        return {
          ...task,
          project,
          assignee,
        };
      });

      return c.json({ data: { ...tasks, documents: populatedTasks } });
    },
  )
  .post(
    '/',
    sessionMiddleware,
    zValidator('json', createTaskSchema),
    async (c) => {
      const [user, databases] = [c.get('user'), c.get('databases')];
      const { name, workspaceId, dueDate, projectId, status, assigneeId } =
        c.req.valid('json');

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: '未授权' }, 401);
      }

      const highestPositionTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal('projectId', projectId),
          Query.equal('workspaceId', workspaceId),
          Query.orderDesc('position'),
          Query.limit(1),
        ],
      );

      const newPosition =
        highestPositionTask.documents.length > 0
          ? highestPositionTask.documents[0].position + 1000
          : 1000;

      const task = await databases.createDocument(
        DATABASE_ID,
        TASKS_ID,
        ID.unique(),
        {
          name,
          workspaceId,
          projectId,
          status,
          assigneeId,
          dueDate,
          position: newPosition,
        },
      );

      return c.json({ data: task });
    },
  );

export default app;
