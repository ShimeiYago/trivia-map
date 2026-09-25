import { SelializedImageFile } from '../../types/selialized-image-file';
import { API_TIMEOUT, BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockPostArticleResponse } from '../mock/articles-response';
import { PostArticleResponse, ValidationError } from './post-remote-article';
import { convertToFile } from 'utils/convert-to-file';

export async function patchRemoteArticle(param: {
  postId: number;
  title?: string;
  description?: string;
  category?: number;
  image?: SelializedImageFile | null;
  isDraft?: boolean;
}): Promise<PostArticleResponse> {
  const axiosInstance = getAxiosInstance({ timeout: API_TIMEOUT.long }, mockPostArticleResponse);

  const requestData = new FormData();
  param.title && requestData.append('title', param.title);
  param.description && requestData.append('description', param.description);
  param.category && requestData.append('category', param.category.toString());
  param.isDraft !== undefined && requestData.append('isDraft', param.isDraft ? 'true' : 'false');

  switch (param.image) {
    case undefined:
      break;
    case null:
      requestData.append('image', '');
      break;
    default:
      const uploadFile = await convertToFile(param.image);
      requestData.append('image', uploadFile);
  }

  try {
    const res: AxiosResponse<PostArticleResponse> = await axiosInstance.patch(
      `${BASE_URL}/articles/${param.postId}`,
      requestData,
    );
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError<ValidationError>(axiosError);
  }
}
