import { API_TIMEOUT, BASE_URL } from 'constant';
import { AxiosError } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';

export async function verifyEmail(key: string): Promise<void> {
  const axiosInstance = getAxiosInstance({ timeout: API_TIMEOUT.long }, {});

  const requestData: VerifyEmailRequest = {
    key: key,
  };

  try {
    await axiosInstance.post(`${BASE_URL}/auths/registration/verify-email`, requestData);
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError<ValidationError>(axiosError);
  }
}

export type VerifyEmailRequest = {
  key: string;
};

export type ValidationError = {
  key?: string[];
};
