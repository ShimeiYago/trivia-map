import { API_TIMEOUT, BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockGetMyArticlesResponse } from '../mock/articles-response';
import { PaginationResponse } from 'api/types/pagination-response';
import { Park } from 'types/park';
import { getUrlParameters } from 'utils/get-url-parameters';

export async function getMyArticles(param: GetMyArticlesParam): Promise<GetMyArticlesResponse> {
  const axiosInstance = getAxiosInstance({ timeout: API_TIMEOUT.short }, mockGetMyArticlesResponse);

  const urlParams = getUrlParameters(param);
  const url = `${BASE_URL}/articles/mine${urlParams}`;

  try {
    const res: AxiosResponse<GetMyArticlesResponse> = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError(axiosError);
  }
}

export type GetMyArticlesResponseEachItem = {
  postId: number;
  title: string;
  category: number;
  isDraft: boolean;
  image: string | null;
  numberOfGoods: number;
};

export type GetMyArticlesParam = {
  page?: number;
  category?: number;
  park?: Park;
  isDraft?: 'true' | 'false';
};

export type GetMyArticlesResponse = PaginationResponse<GetMyArticlesResponseEachItem>;
