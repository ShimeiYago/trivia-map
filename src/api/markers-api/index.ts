import { BASE_URL } from '../constants';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockGetMarkersResponse } from './../mock/markers-response';
import { Position } from 'types/position';

export async function getRemoteMarkers(
  pageIndex: number,
): Promise<GetMarkersResponse> {
  const axiosInstance = getAxiosInstance({}, mockGetMarkersResponse(pageIndex));

  try {
    const res: AxiosResponse<GetMarkersResponse> = await axiosInstance.get(
      `${BASE_URL}/markers?page=${pageIndex}`,
    );
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError(axiosError);
  }
}

export type MarkerTypeAPI = {
  postId: string;
  position: Position;
  title: string;
};

export type GetMarkersResponse = {
  totalPages: number;
  nextPageIndex: number | null;
  markers: MarkerTypeAPI[];
};
