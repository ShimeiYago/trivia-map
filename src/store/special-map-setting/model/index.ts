import { Area } from 'types/area';
import { SelializedImageFile } from '../../../types/selialized-image-file';
import { SelectablePark } from 'types/park';
import { LoadingState } from 'types/loading-state';

export interface SpecialMapSettingState {
  specialMapId?: number;
  title: string;
  description: string;
  isPublic: boolean;
  selectablePark?: SelectablePark;
  thumbnail: string | SelializedImageFile | null;
  area?: Area;
  loading: LoadingState;
  formError?: FormError;
}

export const initialState: SpecialMapSettingState = {
  title: '',
  description: '',
  isPublic: false,
  thumbnail: null,
  loading: 'waiting',
};

export type FormError = {
  errorTitle?: string;
  fieldErrors?: {
    title?: string[];
    description?: string[];
    thumbnail?: string[];
    selectablePark?: string[];
    area?: string[];
  };
};
