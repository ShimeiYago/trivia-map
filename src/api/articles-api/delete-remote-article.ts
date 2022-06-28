import { BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';

export async function deleteRemoteArticle(postId: number): Promise<unknown> {
  const axiosInstance = getAxiosInstance({}, {});

  try {
    // TODO: Set reasonable timeout
    const res: AxiosResponse<unknown> = await axiosInstance.delete(
      `${BASE_URL}/articles/${postId}`,
    );
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError(axiosError);
  }
}
