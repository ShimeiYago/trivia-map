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
  lastSavedTitle: string;
  lastSavedContent: string;
  lastSavedPosition?: Position;
  isFormChangedFromLastSaved: boolean;
}

export const initialState: ArticleFormState = {
  title: '',
  lastSavedTitle: '',
  content: '',
  lastSavedContent: '',
  submittingState: 'waiting',
  fetchingState: 'waiting',
  isEditting: false,
  isFormChangedFromLastSaved: false,
};

export type FormError = {
  errorTitle: string;
  headerErrors?: string[];
  fieldErrors?: {
    title?: string;
    content?: string;
    position?: string;
  };
};
