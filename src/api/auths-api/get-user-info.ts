import { BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { User } from 'types/user';
import { mockGetUserInfoResponse } from 'api/mock/auths-response/get-user-info';

export async function getUserInfo(): Promise<User> {
  const axiosInstance = getAxiosInstance({}, mockGetUserInfoResponse);

  try {
    // TODO: Set reasonable timeout
    const res: AxiosResponse<User> = await axiosInstance.get(`${BASE_URL}/auths/user`);
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError(axiosError);
  }
}
