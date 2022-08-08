import { BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockGetArticlesPreviewsResponse } from '../mock/articles-response';
import { PaginationResponse } from 'api/types/pagination-response';

export async function getMyArticles(
  page?: number,
): Promise<GetMyArticlesResponse> {
  const axiosInstance = getAxiosInstance({}, mockGetArticlesPreviewsResponse);

  let url = `${BASE_URL}/articles/previews/mine`;

  if (page) {
    url = `${url}?page=${page}`;
  }

  try {
    // TODO: Set reasonable timeout
    const res: AxiosResponse<GetMyArticlesResponse> = await axiosInstance.get(
      url,
    );
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError(axiosError);
  }
}

export type GetMyArticlesResponseEachItem = {
  postId: number;
  title: string;
  imageUrl: string | null;
  isDraft: boolean;
};

export type GetMyArticlesResponse =
  PaginationResponse<GetMyArticlesResponseEachItem>;
