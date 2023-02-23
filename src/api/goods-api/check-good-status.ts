import { API_TIMEOUT, BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockCheckGoodStatusResponse } from '../mock/goods-response';

export async function checkGoodStatus(postId: number): Promise<CheckGoodStatusResponse> {
  const axiosInstance = getAxiosInstance(
    { timeout: API_TIMEOUT.short },
    mockCheckGoodStatusResponse,
  );

  const url = `${BASE_URL}/goods/check/${postId}`;

  try {
    const res: AxiosResponse<CheckGoodStatusResponse> = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError(axiosError);
  }
}

export type CheckGoodStatusResponse = {
  haveAddedGood: boolean;
};
