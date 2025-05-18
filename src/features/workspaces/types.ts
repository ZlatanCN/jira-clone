import { Models } from 'node-appwrite';

type Workspace = Models.Document & {
  name: string;
  imageUrl: string;
  inviteCode: string;
  userId: string;
};

export type { Workspace };
