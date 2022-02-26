import { BASE_URL } from '../constants';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import {
  mockGetArticleResponse,
  mockPostArticleResponse,
} from '../mock/articles-response';
import { Position } from 'types/position';

export async function getRemoteArticle(
  postId: string,
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

export async function postRemoteArticle(
  title: string,
  content: string,
  position: Position,
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

export async function putRemoteArticle(
  postId: string,
  title: string,
  content: string,
  position: Position,
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

export type GetArticleResponse = {
  title: string;
  content: string;
};

export type PostArticleRequest = {
  title: string;
  content: string;
  position: Position;
};

export type PostArticleResponse = {
  postId: string;
};

type ValidationError = {
  headerErrors: string[];
  fieldErrors?: {
    title?: string[];
    content?: string[];
    position?: string[];
  };
};
