import { BASE_URL } from '../base-url';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import {
  getCounterMockResponse,
  postCounterMockResponse,
} from '../mock/counter-response';

export async function getRemoteCount(): Promise<GetCounterResponse> {
  const axiosInstance = getAxiosInstance({}, getCounterMockResponse);

  try {
    const res: AxiosResponse<GetCounterResponse> = await axiosInstance.get(
      `${BASE_URL}/counter`,
    );
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError(axiosError);
  }
}

export async function postRemoteCount(
  amount: number,
): Promise<PostCounterResponse> {
  const data = { count: amount };
  const axiosInstance = getAxiosInstance({}, postCounterMockResponse);

  try {
    const res: AxiosResponse<PostCounterResponse> = await axiosInstance.post(
      `${BASE_URL}/counter`,
      data,
    );
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError(axiosError);
  }
}

export type GetCounterResponse = {
  count: number;
};

export type PostCounterResponse = {
  count: number;
};
