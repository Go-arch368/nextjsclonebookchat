// types/avatar.ts
export interface Avatar {
  id: string | number; // Required for DELETE endpoint
  userId: number;
  name: string;
  avatarImageUrl: string;
  jobTitle?: string; // Only used in DefaultAvatarView
  createdAt?: string;
  updatedAt?: string;
}