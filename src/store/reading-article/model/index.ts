import { LoadingState } from 'types/loading-state';

export interface ReadingArticleState {
  postId: string;
  title: string;
  content: string;
  loadingState: LoadingState;
  errorMsg?: string;
}

export const initialState: ReadingArticleState = {
  postId: '',
  title: '',
  content: '',
  loadingState: 'waiting',
};
