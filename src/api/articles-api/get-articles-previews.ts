import { BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockGetArticlesPreviewsResponse } from '../mock/articles-response';
import { PaginationResponse } from 'api/types/pagination-response';
import { Park } from './../../types/park';
import { getUrlParameters } from 'utils/get-url-parameters';

export async function getArticlesPreviews(
  param: GetArticlesPreviewsParam,
): Promise<GetArticlesPreviewsResponse> {
  const axiosInstance = getAxiosInstance({}, mockGetArticlesPreviewsResponse);

  const urlParams = getUrlParameters(param);
  const url = `${BASE_URL}/articles/public/previews${urlParams}`;

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
  image: string | null;
  category: number;
};

export type GetArticlesPreviewsResponse =
  PaginationResponse<GetArticlesPreviewsResponseEachItem>;

export type GetArticlesPreviewsParam = {
  page?: number;
  marker?: number;
  user?: number;
  category?: number;
  park?: Park;
  keywords?: string[];
};
