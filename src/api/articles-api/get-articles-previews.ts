import { BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockGetArticlesPreviewsResponse } from '../mock/articles-response';
import { PaginationResponse } from 'api/types/pagination-response';

export async function getArticlesPreviews(param: {
  key: PreviewKeyType;
  keyId?: number;
  page?: number;
}): Promise<GetArticlesPreviewsResponse> {
  const axiosInstance = getAxiosInstance({}, mockGetArticlesPreviewsResponse);

  let url: string;
  switch (param.key) {
    case 'markerId':
      url = `${BASE_URL}/articles/previews/public/marker/${param.keyId}`;
      break;
    case 'userId':
      url = `${BASE_URL}/articles/previews/public/user/${param.keyId}`;
      break;
    default:
      url = `${BASE_URL}/articles/previews/mine`;
  }

  if (param.page) {
    url = `${url}?page=${param.page}`;
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
  isDraft: boolean;
};

export type GetArticlesPreviewsResponse =
  PaginationResponse<GetArticlesPreviewsResponseEachItem>;

export type PreviewKeyType = 'markerId' | 'userId' | 'mine';
