import { BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { User } from 'types/user';
import { mockGetUserInfoResponse } from 'api/mock/auths-response/get-user-info';
import { SelializedImageFile } from 'types/selialized-image-file';
import { convertToFile } from 'utils/convert-to-file';

export async function updateUserInfo(param: {
  nickname: string;
  icon?: SelializedImageFile | null;
}): Promise<User> {
  const axiosInstance = getAxiosInstance({}, mockGetUserInfoResponse);

  const uploadFile = param.icon ? await convertToFile(param.icon) : param.icon;

  const requestData: UpdateUserInfoRequest = {
    nickname: param.nickname,
    icon: uploadFile,
  };

  try {
    // TODO: Set reasonable timeout
    const res: AxiosResponse<User> = await axiosInstance.put(`${BASE_URL}/auths/user`, requestData);
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError<ValidationError>(axiosError);
  }
}

export type UpdateUserInfoRequest = {
  nickname: string;
  icon?: File | null;
};

export type ValidationError = {
  nickname?: string[];
  icon?: string[];
};
