import { BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockTwitterAccessTokenResponse } from 'api/mock/auths-response/twitter-access-token';

export async function twitterAccessToken(
  requestData: TwitterAccessTokenRequest,
): Promise<TwitterAccessTokenResponse> {
  const axiosInstance = getAxiosInstance({}, mockTwitterAccessTokenResponse);

  try {
    const res: AxiosResponse<TwitterAccessTokenResponse> = await axiosInstance.post(
      `${BASE_URL}/auths/twitter/access-token`,
      requestData,
    );
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError(axiosError);
  }
}

export type TwitterAccessTokenRequest = {
  oauthToken: string;
  oauthVerifier: string;
};

export type TwitterAccessTokenResponse = {
  accessToken: string;
  accessTokeSecret: string;
};
