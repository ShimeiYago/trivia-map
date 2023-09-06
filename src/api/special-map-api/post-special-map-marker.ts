/* istanbul ignore file */

import { API_TIMEOUT, BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { SelializedImageFile } from 'types/selialized-image-file';
import { convertToFile } from 'utils/convert-to-file';
import { Park } from 'types/park';
import { mockPostSpecialMapMarkerResponse } from 'api/mock/special-map-response';
import { MapMarkerVariant } from 'types/marker-icon';

export async function postSpecialMapMarker(param: {
  specialMapId: number;
  description: string;
  image?: SelializedImageFile;
  lat?: number;
  lng?: number;
  park?: Park;
  variant: MapMarkerVariant;
}): Promise<PostSpecialMapMarkerResponse> {
  const axiosInstance = getAxiosInstance(
    { timeout: API_TIMEOUT.long },
    mockPostSpecialMapMarkerResponse,
  );

  const requestData = new FormData();
  requestData.append('description', param.description);
  param.lat && requestData.append('lat', String(param.lat));
  param.lng && requestData.append('lng', String(param.lng));
  param.park && requestData.append('park', param.park);
  requestData.append('variant', param.variant);

  if (param.image) {
    const uploadFile = await convertToFile(param.image);
    requestData.append('image', uploadFile);
  }

  try {
    const res: AxiosResponse<PostSpecialMapMarkerResponse> = await axiosInstance.post(
      `${BASE_URL}/special-map/maps/${param.specialMapId}/post-marker`,
      requestData,
    );
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError<ValidationError>(axiosError);
  }
}

export type PostSpecialMapMarkerResponse = {
  specialMapMarkerId: number;
  specialMap: number;
  lat: number;
  lng: number;
  park: Park;
  description: string;
  variant: MapMarkerVariant;
  image: string | null;
};

export type ValidationError = {
  errorTitle?: string;
  coordinate?: string[];
  image?: string[];
  description?: string[];
  variant?: string[];
};
