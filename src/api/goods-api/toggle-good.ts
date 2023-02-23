import { API_TIMEOUT, BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockToggleGoodResponse } from '../mock/goods-response';

export async function toggleGood(postId: number): Promise<ToggleGoodResponse> {
  const axiosInstance = getAxiosInstance({ timeout: API_TIMEOUT.long }, mockToggleGoodResponse);

  const url = `${BASE_URL}/goods/toggle/${postId}`;

  try {
    const res: AxiosResponse<ToggleGoodResponse> = await axiosInstance.post(url);
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError(axiosError);
  }
}

export type ToggleGoodResponse = {
  haveAddedGood: boolean;
  numberOfGoods: number;
};
