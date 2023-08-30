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
import { PostSpecialMapMarkerResponse, ValidationError } from './post-special-map-marker';

export async function putSpecialMapMarker(param: {
  specialMapMarkerId: number;
  description: string;
  image?: SelializedImageFile | null;
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

  switch (param.image) {
    case undefined:
      break;
    case null:
      requestData.append('image', '');
      break;
    default:
      const uploadFile = await convertToFile(param.image);
      requestData.append('image', uploadFile);
  }

  try {
    const res: AxiosResponse<PostSpecialMapMarkerResponse> = await axiosInstance.post(
      `${BASE_URL}/special-map/markers/${param.specialMapMarkerId}`,
      requestData,
    );
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError<ValidationError>(axiosError);
  }
}
