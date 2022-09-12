import { SelializedImageFile } from './selialized-image-file';

export type User = {
  userId: number;
  email: string;
  nickname: string;
  icon: string | SelializedImageFile | null;
};
