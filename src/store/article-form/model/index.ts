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
  fetchingErrorMsg?: string;
  isEditting: boolean;
}

export const initialState: ArticleFormState = {
  title: '',
  content: '',
  submittingState: 'waiting',
  fetchingState: 'waiting',
  isEditting: false,
};

export type FormError = {
  errorTitle: string;
  headerErrors?: string[];
  fieldErrors?: {
    title?: string[];
    content?: string[];
    position?: string[];
  };
};
