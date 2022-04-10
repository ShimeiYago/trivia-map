import { BASE_URL } from '../constants';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockPostArticleResponse } from '../mock/articles-response';
import { Position } from 'types/position';

export async function postRemoteArticle(
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
    const res: AxiosResponse<PostArticleResponse> = await axiosInstance.post(
      `${BASE_URL}/articles`,
      requestData,
    );
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError<ValidationError>(axiosError);
  }
}

export type PostArticleRequest = {
  title: string;
  content: string;
  position?: Position;
};

export type PostArticleResponse = {
  postId: string;
};

export type ValidationError = {
  headerErrors: string[];
  fieldErrors?: {
    title?: string;
    content?: string;
    position?: string;
  };
};
