import { API_TIMEOUT, BASE_URL } from 'constant';
import { AxiosError } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';

export async function changePassword(password1: string, password2: string): Promise<void> {
  const axiosInstance = getAxiosInstance({ timeout: API_TIMEOUT.long }, {});

  const requestData: ChangePasswordRequest = {
    new_password1: password1,
    new_password2: password2,
  };

  try {
    await axiosInstance.post(`${BASE_URL}/auths/password/change/`, requestData);
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError<ValidationError>(axiosError);
  }
}

export type ChangePasswordRequest = {
  new_password1: string;
  new_password2: string;
};

export type ValidationError = {
  new_password1?: string[];
  new_password2?: string[];
};
