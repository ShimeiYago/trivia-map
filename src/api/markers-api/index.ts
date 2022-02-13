import { BASE_URL } from '../base-url';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockGetMarkersResponse } from './../mock/markers-response';
import { Position } from 'types/position';

export async function getRemoteMarkers(): Promise<GetMarkersResponse> {
  const axiosInstance = getAxiosInstance({}, mockGetMarkersResponse);

  try {
    const res: AxiosResponse<GetMarkersResponse> = await axiosInstance.get(
      `${BASE_URL}/markers`,
    );
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError(axiosError);
  }
}

type Marker = {
  postId: string;
  position: Position;
  title: string;
};

export type GetMarkersResponse = Marker[];
