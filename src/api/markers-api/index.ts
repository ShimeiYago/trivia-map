import { PaginationResponse } from './../types/pagination-response';
import { BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockGetMarkersResponse } from './../mock/markers-response';

export async function getRemoteMarkers(
  nextUrl?: string,
): Promise<GetMarkersResponseWithPagination> {
  const url = nextUrl ?? `${BASE_URL}/markers`;

  const axiosInstance = getAxiosInstance({}, mockGetMarkersResponse(nextUrl));

  try {
    const res: AxiosResponse<GetMarkersResponseWithPagination> =
      await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError(axiosError);
  }
}

export type GetMarkersResponse = {
  markerId: number;
  lat: number;
  lng: number;
  park: 'L' | 'S';
  numberOfPublicArticles: number;
};

export type GetMarkersResponseWithPagination =
  PaginationResponse<GetMarkersResponse>;
