import { API_TIMEOUT, BASE_URL } from 'constant';
import { AxiosError } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';

export async function resetPassword(email: string): Promise<void> {
  const axiosInstance = getAxiosInstance({ timeout: API_TIMEOUT.long }, {});

  const requestData: ResetPasswordRequest = {
    email: email,
  };

  try {
    await axiosInstance.post(`${BASE_URL}/auths/password/reset/`, requestData);
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError<ValidationError>(axiosError);
  }
}

export type ResetPasswordRequest = {
  email: string;
};

export type ValidationError = {
  email?: string[];
  non_field_errors?: string[];
};
