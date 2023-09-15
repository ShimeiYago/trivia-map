/* istanbul ignore file */

import { API_TIMEOUT, BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { SelializedImageFile } from 'types/selialized-image-file';
import { convertToFile } from 'utils/convert-to-file';
import { SelectablePark } from 'types/park';
import { mockPostSpecialMapResponse } from 'api/mock/special-map-response';
import { PostSpecialMapResponse, ValidationError } from './post-special-map';

export async function putSpecialMap(param: {
  specialMapId: number;
  title: string;
  description: string;
  isPublic: boolean;
  selectablePark?: SelectablePark;
  thumbnail?: SelializedImageFile | null;
  minLatitude?: number;
  maxLatitude?: number;
  minLongitude?: number;
  maxLongitude?: number;
}): Promise<PostSpecialMapResponse> {
  const axiosInstance = getAxiosInstance({ timeout: API_TIMEOUT.long }, mockPostSpecialMapResponse);

  const requestData = new FormData();
  requestData.append('title', param.title);
  requestData.append('description', param.description);
  param.selectablePark && requestData.append('selectablePark', param.selectablePark);
  requestData.append('isPublic', param.isPublic ? 'true' : 'false');
  param.minLatitude !== undefined && requestData.append('minLatitude', String(param.minLatitude));
  param.maxLatitude !== undefined && requestData.append('maxLatitude', String(param.maxLatitude));
  param.minLongitude !== undefined &&
    requestData.append('minLongitude', String(param.minLongitude));
  param.maxLongitude !== undefined &&
    requestData.append('maxLongitude', String(param.maxLongitude));

  switch (param.thumbnail) {
    case undefined:
      break;
    case null:
      requestData.append('thumbnail', '');
      break;
    default:
      const uploadFile = await convertToFile(param.thumbnail);
      requestData.append('thumbnail', uploadFile);
  }

  try {
    const res: AxiosResponse<PostSpecialMapResponse> = await axiosInstance.put(
      `${BASE_URL}/special-map/maps/${param.specialMapId}`,
      requestData,
    );
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError<ValidationError>(axiosError);
  }
}
