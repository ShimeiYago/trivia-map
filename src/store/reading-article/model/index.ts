import { LoadingState } from 'types/loading-state';
import { Position } from 'types/position';
import { Author } from 'types/author';

export interface ReadingArticleState {
  postId: number;
  title: string;
  description: string;
  position: Position;
  imageUrl: string | null;
  author: Author;
  createdAt: string;
  updatedAt: string;
  loadingState: LoadingState;
  errorMsg?: string;
}

export const initialState: ReadingArticleState = {
  postId: -1,
  title: '',
  description: '',
  loadingState: 'waiting',
  position: {
    lat: 0,
    lng: 0,
    park: 'L',
  },
  imageUrl: null,
  author: {
    userId: -1,
    nickname: '',
  },
  createdAt: '',
  updatedAt: '',
};
