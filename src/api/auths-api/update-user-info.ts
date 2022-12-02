import { API_TIMEOUT, BASE_URL } from 'constant';
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
  const axiosInstance = getAxiosInstance({ timeout: API_TIMEOUT.long }, mockGetUserInfoResponse);

  const requestData = new FormData();
  requestData.append('nickname', param.nickname);

  switch (param.icon) {
    case undefined:
      break;
    case null:
      requestData.append('icon', '');
      break;
    default:
      const uploadFile = await convertToFile(param.icon);
      requestData.append('icon', uploadFile);
  }

  try {
    const res: AxiosResponse<User> = await axiosInstance.put(
      `${BASE_URL}/auths/user/update/`,
      requestData,
    );
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError<ValidationError>(axiosError);
  }
}

export type ValidationError = {
  nickname?: string[];
  icon?: string[];
};
