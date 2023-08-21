import { API_TIMEOUT, BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { SelializedImageFile } from 'types/selialized-image-file';
import { convertToFile } from 'utils/convert-to-file';
import { SelectablePark } from 'types/park';
import { mockPostSpecialMapResponse } from 'api/mock/special-map-response';

export async function postSpecialMap(param: {
  title: string;
  description: string;
  isPublic: boolean;
  selectablePark: SelectablePark;
  thumbnail?: SelializedImageFile;
  minLatitude?: number;
  maxLatitude?: number;
  minLongitude?: number;
  maxLongitude?: number;
}): Promise<PostSpecialMapResponse> {
  const axiosInstance = getAxiosInstance({ timeout: API_TIMEOUT.long }, mockPostSpecialMapResponse);

  const requestData = new FormData();
  requestData.append('title', param.title);
  requestData.append('description', param.description);
  requestData.append('selectablePark', param.selectablePark);
  requestData.append('isPublic', param.isPublic ? 'true' : 'false');
  param.minLatitude ?? requestData.append('minLatitude', String(param.minLatitude));
  param.maxLatitude ?? requestData.append('maxLatitude', String(param.maxLatitude));
  param.minLongitude ?? requestData.append('minLongitude', String(param.minLongitude));
  param.maxLongitude ?? requestData.append('maxLongitude', String(param.maxLongitude));

  if (param.thumbnail) {
    const uploadFile = await convertToFile(param.thumbnail);
    requestData.append('thumbnail', uploadFile);
  }

  try {
    const res: AxiosResponse<PostSpecialMapResponse> = await axiosInstance.post(
      `${BASE_URL}/special-map/maps`,
      requestData,
    );
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError<ValidationError>(axiosError);
  }
}

export type PostSpecialMapResponse = {
  specialMapId: number;
  title: string;
  description: string;
  isPublic: boolean;
  selectablePark: SelectablePark;
  thumbnail: string | null;
  minLatitude: number;
  maxLatitude: number;
  minLongitude: number;
  maxLongitude: number;
};

export type ValidationError = {
  errorTitle?: string;
  title?: string[];
  description: string[];
  isPublic: string[];
  selectablePark: string[];
  thumbnail?: string[];
  non_field_errors?: string[];
};
