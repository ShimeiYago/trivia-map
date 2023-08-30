import { SelializedImageFile } from '../../../types/selialized-image-file';
import { Park } from 'types/park';
import { LoadingState } from 'types/loading-state';
import { MapMarkerVariant } from 'types/marker-icon';

export interface SpecialMapMarkerFormState {
  specialMapMarkerId?: number;
  lat?: number;
  lng?: number;
  park?: Park;
  image: string | SelializedImageFile | null;
  description: string;
  variant: MapMarkerVariant;
  submittingState: LoadingState;
  formError?: FormError;
}

export const initialState: SpecialMapMarkerFormState = {
  description: '',
  image: null,
  submittingState: 'waiting',
  variant: 'red',
};

export type FormError = {
  errorTitle?: string;
  fieldErrors?: {
    coordinate?: string[];
    description?: string[];
    image?: string[];
    park?: string[];
    variant?: string[];
  };
};
