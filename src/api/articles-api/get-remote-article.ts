import { BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockGetArticleResponse } from '../mock/articles-response';
import { Author } from 'types/author';

export async function getRemoteArticle(
  postId: number,
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
  postId: number;
  title: string;
  description: string;
  marker: {
    markerId: number;
    lat: number;
    lng: number;
    park: 'L' | 'S';
    numberOfPublicArticles: number;
  };
  imageUrl: string | null;
  author: Author;
  createdAt: string;
  updatedAt: string;
};
