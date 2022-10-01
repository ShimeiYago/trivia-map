import { BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockRefreshTokenResponse } from 'api/mock/auths-response/refresh-token';

export async function refreshToken(): Promise<RefreshTokenResponse> {
  const axiosInstance = getAxiosInstance({}, mockRefreshTokenResponse);

  try {
    const res: AxiosResponse<RefreshTokenResponse> = await axiosInstance.post(
      `${BASE_URL}/auths/token/refresh`,
    );
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError(axiosError);
  }
}

export type RefreshTokenResponse = {
  access: string;
  access_token_expiration: string;
};
