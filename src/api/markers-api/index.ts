import { PaginationResponse } from './../types/pagination-response';
import { BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockGetMarkersResponse } from './../mock/markers-response';
import { Park } from './../../types/park';

export async function getRemoteMarkers(
  params: GetRemoteMarkersParams,
): Promise<GetMarkersResponseWithPagination> {
  let url;
  if (params.nextUrl) {
    url = params.nextUrl;
  } else {
    url = `${BASE_URL}/markers/${params.park}`;
    if (params.category) {
      url = `${url}?catregory=${params.category}`;
    }
  }

  const axiosInstance = getAxiosInstance({}, mockGetMarkersResponse(params.nextUrl));

  try {
    const res: AxiosResponse<GetMarkersResponseWithPagination> = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError(axiosError);
  }
}

type GetRemoteMarkersParams = {
  park: Park;
  category?: number;
  nextUrl?: string;
};

export type GetMarkersResponse = {
  markerId: number;
  lat: number;
  lng: number;
  park: Park;
  numberOfPublicArticles: number;
};

export type GetMarkersResponseWithPagination = PaginationResponse<GetMarkersResponse>;
