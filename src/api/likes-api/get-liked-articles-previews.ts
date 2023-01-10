import { API_TIMEOUT } from '../../constant/index';
import { BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { getUrlParameters } from 'utils/get-url-parameters';
import { GetArticlesPreviewsResponseEachItem } from 'api/articles-api/get-articles-previews';
import { PaginationResponse } from 'api/types/pagination-response';
import { mockGetLikedArticlesPreviewsResponse } from 'api/mock/likes-response';

export async function getLikedArticlesPreviews(
  param: GetLikedArticlesPreviewsParam,
): Promise<GetLikedArticlesPreviewsResponse> {
  const axiosInstance = getAxiosInstance(
    { timeout: API_TIMEOUT.short },
    mockGetLikedArticlesPreviewsResponse,
  );

  const urlParams = getUrlParameters(param);
  const url = `${BASE_URL}/likes/mine${urlParams}`;

  try {
    const res: AxiosResponse<GetLikedArticlesPreviewsResponse> = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError(axiosError);
  }
}

export type GetLikedArticlesPreviewsResponseEachItem = {
  article: GetArticlesPreviewsResponseEachItem;
};

export type GetLikedArticlesPreviewsResponse =
  PaginationResponse<GetLikedArticlesPreviewsResponseEachItem>;

export type GetLikedArticlesPreviewsParam = {
  page?: number;
};
