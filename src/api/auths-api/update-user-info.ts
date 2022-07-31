import { BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { User } from 'types/user';
import { mockGetUserInfoResponse } from 'api/mock/auths-response/get-user-info';

export async function updateUserInfo(nickname: string): Promise<User> {
  const axiosInstance = getAxiosInstance({}, mockGetUserInfoResponse);

  const requestData: UpdateUserInfoRequest = {
    nickname: nickname,
  };

  try {
    // TODO: Set reasonable timeout
    const res: AxiosResponse<User> = await axiosInstance.put(
      `${BASE_URL}/auths/user`,
      requestData,
    );
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError<ValidationError>(axiosError);
  }
}

export type UpdateUserInfoRequest = {
  nickname: string;
};

export type ValidationError = {
  nickname?: string[];
};
