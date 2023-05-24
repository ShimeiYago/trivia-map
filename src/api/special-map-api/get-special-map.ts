import { BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockGetSpecialMapResponse } from 'api/mock/special-map-response';

export async function getSpecialMap(mapId: number): Promise<GetSpecialMapResponse> {
  const url = `${BASE_URL}/special-map/maps/${mapId}`;

  const axiosInstance = getAxiosInstance({}, mockGetSpecialMapResponse);

  try {
    const res: AxiosResponse<GetSpecialMapResponse> = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError(axiosError);
  }
}

export type GetSpecialMapResponse = {
  specialMapId: number;
  title: string;
  thumbnail: string | null;
  isPublic: boolean;
  description: string;
};
