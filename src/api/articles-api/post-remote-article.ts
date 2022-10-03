import { API_TIMEOUT, BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockPostArticleResponse } from '../mock/articles-response';
import { Position } from 'types/position';
import { SelializedImageFile } from 'types/selialized-image-file';
import { convertToFile } from 'utils/convert-to-file';

export async function postRemoteArticle(param: {
  title: string;
  description: string;
  marker?: Position;
  category?: number;
  image?: SelializedImageFile;
  isDraft: boolean;
}): Promise<PostArticleResponse> {
  const axiosInstance = getAxiosInstance({ timeout: API_TIMEOUT.long }, mockPostArticleResponse);

  const requestData = new FormData();
  requestData.append('title', param.title);
  requestData.append('description', param.description);
  param.marker && requestData.append('marker', JSON.stringify(param.marker));
  param.category && requestData.append('category', param.category.toString());
  requestData.append('isDraft', param.isDraft ? 'true' : 'false');

  if (param.image) {
    const uploadFile = await convertToFile(param.image);
    requestData.append('image', uploadFile);
  }

  try {
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

export type PostArticleResponse = {
  postId: number;
  title: string;
  description: string;
  marker: number;
  image: string | null;
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
  image?: string[];
  isDraft?: string[];
};
