import { SelializedImageFile } from '../../../types/selialized-image-file';
import { LoadingState } from 'types/loading-state';
import { Position } from 'types/position';

export interface ArticleFormState {
  postId?: number;
  title: string;
  description: string;
  position?: Position;
  areaNames?: string[];
  image: string | SelializedImageFile | null;
  category?: number;
  submittingState: LoadingState;
  fetchingState: LoadingState;
  formError?: FormError;
  isEditting: boolean;
  lastSavedTitle: string;
  lastSavedDescription: string;
  lastSavedPosition?: Position;
  lastSavedImage: string | SelializedImageFile | null;
  lastSavedCategory?: number;
  isFormChangedFromLastSaved: boolean;
  isDraft: boolean;
  lastSavedIsDraft: boolean;
  submitSuccessInfo?: SubmitSuccessInfo;
}

export const initialState: ArticleFormState = {
  title: '',
  lastSavedTitle: '',
  description: '',
  lastSavedDescription: '',
  image: null,
  lastSavedImage: null,
  submittingState: 'waiting',
  fetchingState: 'waiting',
  isEditting: false,
  isFormChangedFromLastSaved: false,
  isDraft: false,
  lastSavedIsDraft: false,
};

export type FormError = {
  errorTitle: string;
  fieldErrors?: {
    title?: string[];
    description?: string[];
    marker?: string[];
    image?: string[];
  };
};

export type SubmitSuccessInfo = {
  postId: number;
  title: string;
  description: string;
};
