import { BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockGetArticlesPreviewsResponse } from '../mock/articles-response';
import { PaginationResponse } from 'api/types/pagination-response';

export async function getArticlesPreviews(
  param: GetArticlesPreviewsParam,
): Promise<GetArticlesPreviewsResponse> {
  const axiosInstance = getAxiosInstance({}, mockGetArticlesPreviewsResponse);

  let url = `${BASE_URL}/articles/public/previews`;

  const apiParmas = [];
  if (param.page) {
    apiParmas.push(`page=${param.page}`);
  }
  if (param.marker) {
    apiParmas.push(`marker=${param.marker}`);
  }
  if (param.user) {
    apiParmas.push(`user=${param.user}`);
  }
  if (param.category) {
    apiParmas.push(`category=${param.category}`);
  }
  if (param.park) {
    apiParmas.push(`park=${param.park}`);
  }

  if (apiParmas.length > 0) {
    url = `${url}?${apiParmas.join('&')}`;
  }

  try {
    // TODO: Set reasonable timeout
    const res: AxiosResponse<GetArticlesPreviewsResponse> =
      await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError(axiosError);
  }
}

export type GetArticlesPreviewsResponseEachItem = {
  postId: number;
  title: string;
  imageUrl: string | null;
  category: number;
};

export type GetArticlesPreviewsResponse =
  PaginationResponse<GetArticlesPreviewsResponseEachItem>;

export type GetArticlesPreviewsParam = {
  page?: number;
  marker?: number;
  user?: number;
  category?: number;
  park?: 'L' | 'S';
};
