import { LoadingState } from 'types/loading-state';
import { Position } from 'types/position';

export interface ArticleFormState {
  postId?: string;
  title: string;
  content: string;
  position?: Position;
  submittingState: LoadingState;
  fetchingState: LoadingState;
  formError?: FormError;
}

export const initialState: ArticleFormState = {
  title: '',
  content: '',
  submittingState: 'waiting',
  fetchingState: 'waiting',
};

export type FormError = {
  headerErrors: string[];
  fieldErrors?: {
    title?: string[];
    content?: string[];
    position?: string[];
  };
};
