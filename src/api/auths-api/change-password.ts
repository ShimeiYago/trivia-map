import { BASE_URL } from 'constant';
import { AxiosError } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';

export async function changePassword(
  password1: string,
  password2: string,
): Promise<void> {
  const axiosInstance = getAxiosInstance({}, {});

  const requestData: ChangePasswordRequest = {
    password1: password1,
    password2: password2,
  };

  try {
    // TODO: Set reasonable timeout
    await axiosInstance.post(`${BASE_URL}/auths/password/change`, requestData);
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError<ValidationError>(axiosError);
  }
}

export type ChangePasswordRequest = {
  password1: string;
  password2: string;
};

export type ValidationError = {
  password1?: string[];
  password2?: string[];
};
