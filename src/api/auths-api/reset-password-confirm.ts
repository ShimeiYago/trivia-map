import { BASE_URL } from 'constant';
import { AxiosError } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';

export async function resetPasswordConfirm(
  password1: string,
  password2: string,
  uid: string,
  token: string,
): Promise<void> {
  const axiosInstance = getAxiosInstance({}, {});

  const requestData: ResetPasswordConfirmRequest = {
    password1: password1,
    password2: password2,
    uid: uid,
    token: token,
  };

  try {
    // TODO: Set reasonable timeout
    await axiosInstance.post(`${BASE_URL}/auths/password/reset/confirm`, requestData);
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError<ValidationError>(axiosError);
  }
}

export type ResetPasswordConfirmRequest = {
  password1: string;
  password2: string;
  uid: string;
  token: string;
};

export type ValidationError = {
  password1?: string[];
  password2?: string[];
  uid?: string[];
  token?: string[];
};
