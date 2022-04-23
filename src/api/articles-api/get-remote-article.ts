import { BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockGetArticleResponse } from '../mock/articles-response';
import { Position } from 'types/position';

export async function getRemoteArticle(
  postId: string,
): Promise<GetArticleResponse> {
  const axiosInstance = getAxiosInstance({}, mockGetArticleResponse);

  try {
    // TODO: Set reasonable timeout
    const res: AxiosResponse<GetArticleResponse> = await axiosInstance.get(
      `${BASE_URL}/articles/${postId}`,
    );
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError(axiosError);
  }
}

export type GetArticleResponse = {
  title: string;
  content: string;
  position: Position;
  imageDataUrl: string | null;
};
