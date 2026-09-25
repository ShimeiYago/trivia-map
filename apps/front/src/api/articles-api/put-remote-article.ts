import { SelializedImageFile } from '../../types/selialized-image-file';
import { API_TIMEOUT, BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockPostArticleResponse } from '../mock/articles-response';
import { Position } from 'types/position';
import { PostArticleResponse, ValidationError } from './post-remote-article';
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
  const axiosInstance = getAxiosInstance({ timeout: API_TIMEOUT.long }, mockPostArticleResponse);

  const requestData = new FormData();
  requestData.append('title', param.title);
  requestData.append('description', param.description);
  requestData.append('marker', JSON.stringify(param.marker));
  param.category && requestData.append('category', param.category.toString());
  requestData.append('isDraft', param.isDraft ? 'true' : 'false');

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
