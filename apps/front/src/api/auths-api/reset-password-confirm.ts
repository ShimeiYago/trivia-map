import { API_TIMEOUT, BASE_URL } from 'constant';
import { AxiosError } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';

export async function resetPasswordConfirm(param: {
  password1: string;
  password2: string;
  uid: string;
  token: string;
}): Promise<void> {
  const axiosInstance = getAxiosInstance({ timeout: API_TIMEOUT.long }, {});

  const requestData: ResetPasswordConfirmRequest = {
    new_password1: param.password1,
    new_password2: param.password2,
    uid: param.uid,
    token: param.token,
  };

  try {
    await axiosInstance.post(`${BASE_URL}/auths/password/reset/confirm/`, requestData);
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError<ValidationError>(axiosError);
  }
}

export type ResetPasswordConfirmRequest = {
  new_password1: string;
  new_password2: string;
  uid: string;
  token: string;
};

export type ValidationError = {
  new_password1?: string[];
  new_password2?: string[];
  uid?: string[];
  token?: string[];
};
