import { SelializedImageFile } from '../../types/selialized-image-file';
import { BASE_URL } from 'constant';
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
import { convertToFile } from 'utils/convert-to-file';

export async function putRemoteArticle(param: {
  postId: number;
  title: string;
  description: string;
  category?: number;
  marker: Position;
  image?: SelializedImageFile | null;
  isDraft: boolean;
}): Promise<PostArticleResponse> {
  const axiosInstance = getAxiosInstance({}, mockPostArticleResponse);

  const uploadFile = param.image
    ? await convertToFile(param.image)
    : param.image;

  const requestData: PostArticleRequest = {
    title: param.title,
    description: param.description,
    marker: param.marker,
    category: param.category,
    image: uploadFile,
    isDraft: param.isDraft,
  };

  try {
    // TODO: Set reasonable timeout
    const res: AxiosResponse<PostArticleResponse> = await axiosInstance.put(
      `${BASE_URL}/articles/${param.postId}`,
      requestData,
    );
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError<ValidationError>(axiosError);
  }
}
