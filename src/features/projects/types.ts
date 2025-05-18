import { Models } from 'node-appwrite';

type Project = Models.Document & {
  name: string;
  imageUrl: string;
  workspaceId: string;
};

export type { Project };
