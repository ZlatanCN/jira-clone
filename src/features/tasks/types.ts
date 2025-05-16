import { Models } from 'node-appwrite';

enum TaskStatus {
  BACKLOG = 'BACKLOG',
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE',
}

type Task = Models.Document & {
  projectId: string;
  assigneeId: string;
  status: TaskStatus;
  workspaceId: string;
  name: string;
  dueDate: string;
  position: number;
};

export { TaskStatus };
export type { Task };
