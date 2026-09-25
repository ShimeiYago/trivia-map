import { mockTwitterRequestTokenResponse } from './../mock/auths-response/twitter-request-token';
import { BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';

export async function twitterRequestToken(
  requestData: TwitterRequestTokenRequest,
): Promise<TwitterRequestTokenResponse> {
  const axiosInstance = getAxiosInstance({}, mockTwitterRequestTokenResponse);

  try {
    const res: AxiosResponse<TwitterRequestTokenResponse> = await axiosInstance.post(
      `${BASE_URL}/auths/twitter/request-token`,
      requestData,
    );
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError(axiosError);
  }
}

export type TwitterRequestTokenRequest = {
  callbackUrl: string;
};

export type TwitterRequestTokenResponse = {
  authenticateUrl: string;
};
