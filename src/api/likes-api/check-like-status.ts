import { API_TIMEOUT, BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockCheckLikeStatusResponse } from '../mock/likes-response';

export async function checkLikeStatus(postId: number): Promise<CheckLikeStatusResponse> {
  const axiosInstance = getAxiosInstance(
    { timeout: API_TIMEOUT.short },
    mockCheckLikeStatusResponse,
  );

  const url = `${BASE_URL}/likes/check/${postId}`;

  try {
    const res: AxiosResponse<CheckLikeStatusResponse> = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError(axiosError);
  }
}

export type CheckLikeStatusResponse = {
  haveLiked: boolean;
};
