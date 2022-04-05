import { BASE_URL } from '../constants';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockPostArticleResponse } from '../mock/articles-response';
import { Position } from 'types/position';
import {
  PostArticleRequest,
  PostArticleResponse,
  ValidationError,
} from './post-remote-article';

export async function putRemoteArticle(
  postId: string,
  title: string,
  content: string,
  position?: Position,
): Promise<PostArticleResponse> {
  const axiosInstance = getAxiosInstance({}, mockPostArticleResponse);

  const requestData: PostArticleRequest = {
    title: title,
    content: content,
    position: position,
  };

  try {
    // TODO: Set reasonable timeout
    const res: AxiosResponse<PostArticleResponse> = await axiosInstance.put(
      `${BASE_URL}/articles/${postId}`,
      requestData,
    );
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError<ValidationError>(axiosError);
  }
}
