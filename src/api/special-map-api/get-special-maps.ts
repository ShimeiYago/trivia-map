import { PaginationResponse } from '../types/pagination-response';
import { BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockGetSpecialMapsResponseWithPagination } from 'api/mock/special-map-response';
import { getUrlParameters } from 'utils/get-url-parameters';
import { GetSpecialMapResponse } from './get-special-map';

export async function getSpecialMaps(param: {
  page?: number;
}): Promise<GetSpecialMapsResponseWithPagination> {
  const urlParams = getUrlParameters(param);
  const url = `${BASE_URL}/special-map/maps${urlParams}`;

  const axiosInstance = getAxiosInstance({}, mockGetSpecialMapsResponseWithPagination);

  try {
    const res: AxiosResponse<GetSpecialMapsResponseWithPagination> = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError(axiosError);
  }
}

export type GetSpecialMapsResponseWithPagination = PaginationResponse<GetSpecialMapResponse>;
