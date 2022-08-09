import { BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockPostArticleResponse } from '../mock/articles-response';
import { Position } from 'types/position';

export async function postRemoteArticle(param: {
  title: string;
  description: string;
  marker: Position;
  category?: number;
  imageUrl: string | null;
  isDraft: boolean;
}): Promise<PostArticleResponse> {
  const axiosInstance = getAxiosInstance({}, mockPostArticleResponse);

  const requestData: PostArticleRequest = {
    title: param.title,
    description: param.description,
    marker: param.marker,
    imageUrl: param.imageUrl,
    isDraft: param.isDraft,
    category: param.category,
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
  description: string;
  marker: Position;
  imageUrl: string | null;
  isDraft: boolean;
  category?: number;
};

export type PostArticleResponse = {
  postId: number;
  title: string;
  description: string;
  marker: number;
  imageUrl: string | null;
  category: number;
  isDraft: boolean;
  author: number;
  createdAt: string;
  updatedAt: string;
};

export type ValidationError = {
  title?: string[];
  description?: string[];
  marker?: string[];
  imageUrl?: string[];
  isDraft?: string[];
};
