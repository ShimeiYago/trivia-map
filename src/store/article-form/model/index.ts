import { LoadingState } from 'types/loading-state';
import { Position } from 'types/position';

export interface ArticleFormState {
  postId?: number;
  title: string;
  description: string;
  position?: Position;
  previousMarkerId?: number;
  imageDataUrl: string | null;
  submittingState: LoadingState;
  fetchingState: LoadingState;
  formError?: FormError;
  fetchingErrorMsg?: string;
  isEditting: boolean;
  lastSavedTitle: string;
  lastSavedDescription: string;
  lastSavedPosition?: Position;
  lastSavedImageDataUrl: string | null;
  isFormChangedFromLastSaved: boolean;
  isDraft: boolean;
}

export const initialState: ArticleFormState = {
  title: '',
  lastSavedTitle: '',
  description: '',
  lastSavedDescription: '',
  imageDataUrl: null,
  lastSavedImageDataUrl: null,
  submittingState: 'waiting',
  fetchingState: 'waiting',
  isEditting: false,
  isFormChangedFromLastSaved: false,
  isDraft: false,
};

export type FormError = {
  errorTitle: string;
  fieldErrors?: {
    title?: string;
    description?: string;
    position?: string;
    imageDataUrl?: string;
    isDraft?: string;
  };
};
