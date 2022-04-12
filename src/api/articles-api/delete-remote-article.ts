import { BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockDeleteArticleResponse } from 'api/mock/articles-response';

export async function deleteRemoteArticle(
  postId: string,
): Promise<DeleteArticleResponse> {
  const axiosInstance = getAxiosInstance({}, mockDeleteArticleResponse);

  try {
    // TODO: Set reasonable timeout
    const res: AxiosResponse<DeleteArticleResponse> =
      await axiosInstance.delete(`${BASE_URL}/articles/${postId}`);
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError(axiosError);
  }
}

export type DeleteArticleResponse = {
  postId: string;
};
