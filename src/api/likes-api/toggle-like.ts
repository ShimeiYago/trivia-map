import { API_TIMEOUT, BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockToggleLikeResponse } from '../mock/likes-response';

export async function toggleLike(postId: number): Promise<ToggleLikeResponse> {
  const axiosInstance = getAxiosInstance({ timeout: API_TIMEOUT.long }, mockToggleLikeResponse);

  const url = `${BASE_URL}/likes/toggle/${postId}`;

  try {
    const res: AxiosResponse<ToggleLikeResponse> = await axiosInstance.post(url);
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError(axiosError);
  }
}

export type ToggleLikeResponse = {
  haveLiked: boolean;
};
