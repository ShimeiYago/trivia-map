import { PaginationResponse } from '../types/pagination-response';
import { BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockGetSpecialMapMarkersResponseWithPagination } from 'api/mock/special-map-response';
import { getUrlParameters } from 'utils/get-url-parameters';
import { Park } from 'types/park';
import { MapMarkerVariant } from 'types/marker-icon';

export async function getSpecialMapMarkers(param: {
  mapId: number;
  page?: number;
}): Promise<GetSpecialMapMarkersResponseWithPagination> {
  const urlParams = getUrlParameters({ page: param.page });
  const url = `${BASE_URL}/special-map/maps/${param.mapId}/markers${urlParams}`;

  const axiosInstance = getAxiosInstance({}, mockGetSpecialMapMarkersResponseWithPagination);

  try {
    const res: AxiosResponse<GetSpecialMapMarkersResponseWithPagination> = await axiosInstance.get(
      url,
    );
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError(axiosError);
  }
}

export type GetSpecialMapMarkersResponse = {
  specialMapMarkerId: number;
  lat: number;
  lng: number;
  park: Park;
  image: string | null;
  description: string;
  variant: MapMarkerVariant;
};

export type GetSpecialMapMarkersResponseWithPagination =
  PaginationResponse<GetSpecialMapMarkersResponse>;
