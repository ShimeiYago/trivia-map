import { SelializedImageFile } from '../../../types/selialized-image-file';
import { LoadingState } from 'types/loading-state';
import { Position } from 'types/position';

export interface ArticleFormState {
  postId?: number;
  title: string;
  description: string;
  position?: Position;
  areaNames?: string[];
  previousMarkerId?: number;
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
};

export type FormError = {
  errorTitle: string;
  fieldErrors?: {
    title?: string;
    description?: string;
    position?: string;
    image?: string;
    isDraft?: string;
  };
};
