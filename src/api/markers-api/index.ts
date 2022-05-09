import { BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockGetMarkersResponse } from './../mock/markers-response';
import { Position } from 'types/position';

export async function getRemoteMarkers(
  nextUrl?: string,
): Promise<GetMarkersResponse> {
  const url = nextUrl ?? `${BASE_URL}/markers`;

  const axiosInstance = getAxiosInstance({}, mockGetMarkersResponse(nextUrl));

  try {
    const res: AxiosResponse<GetMarkersResponse> = await axiosInstance.get(url);
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
  thumbnailImgUrl?: string;
};

export type GetMarkersResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: MarkerTypeAPI[];
};
