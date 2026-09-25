import { PaginationResponse } from './../types/pagination-response';
import { BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockGetMarkersResponse } from './../mock/markers-response';
import { Park } from './../../types/park';
import { Marker } from 'types/marker';
import { getUrlParameters } from 'utils/get-url-parameters';

export async function getRemoteMarkers(
  params: GetRemoteMarkersParams,
): Promise<GetMarkersResponseWithPagination> {
  let url;
  if (params.nextUrl) {
    url = params.nextUrl;
  } else {
    url = `${BASE_URL}/markers/${params.park}`;

    const urlParams = getUrlParameters({ category: params.category, user: params.userId });
    url += urlParams;
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
  userId?: number;
  nextUrl?: string;
};

export type GetMarkersResponse = Omit<Marker, 'areaNames'>;

export type GetMarkersResponseWithPagination = PaginationResponse<GetMarkersResponse>;
