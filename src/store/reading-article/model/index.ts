import { LoadingState } from 'types/loading-state';
import { Position } from 'types/position';

export interface ReadingArticleState {
  postId: string;
  title: string;
  content: string;
  position: Position;
  imageUrl: string | null;
  loadingState: LoadingState;
  errorMsg?: string;
}

export const initialState: ReadingArticleState = {
  postId: '',
  title: '',
  content: '',
  loadingState: 'waiting',
  position: { lat: 0, lng: 0 },
  imageUrl: null,
};
