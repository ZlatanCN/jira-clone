import { Models } from 'node-appwrite';

enum MemberRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

type Member = Models.Document & {
  userId: string;
  workspaceId: string;
  role: MemberRole;
};

export { MemberRole };
export type { Member };
