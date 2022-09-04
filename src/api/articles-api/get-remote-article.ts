import { BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockGetArticleResponse } from '../mock/articles-response';
import { Author } from 'types/author';
import { Park } from './../../types/park';

export async function getRemoteArticle(
  postId: number,
): Promise<GetArticleResponse> {
  const axiosInstance = getAxiosInstance({}, mockGetArticleResponse);

  try {
    // TODO: Set reasonable timeout
    const res: AxiosResponse<GetArticleResponse> = await axiosInstance.get(
      `${BASE_URL}/articles/detail/${postId}`,
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
    park: Park;
    numberOfPublicArticles: number;
    areaNames: string[];
  };
  category: number;
  image: string | null;
  isDraft: boolean;
  author: Author;
  createdAt: string;
  updatedAt: string;
};
