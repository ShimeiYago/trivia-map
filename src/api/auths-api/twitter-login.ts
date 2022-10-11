import { API_TIMEOUT, BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockLoginResponse } from 'api/mock/auths-response/login';
import { TwitterAccessTokenResponse } from './twitter-access-token';
import { LoginResponse, ValidationError } from './login';

export async function twitterLogin(param: TwitterAccessTokenResponse): Promise<LoginResponse> {
  const axiosInstance = getAxiosInstance({ timeout: API_TIMEOUT.long }, mockLoginResponse);

  const requestData: TwitterLoginRequest = {
    access_token: param.accessToken,
    token_secret: param.accessTokeSecret,
  };

  try {
    const res: AxiosResponse<LoginResponse> = await axiosInstance.post(
      `${BASE_URL}/auths/twitter/login`,
      requestData,
    );
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError<ValidationError>(axiosError);
  }
}

export type TwitterLoginRequest = {
  access_token: string;
  token_secret: string;
};
