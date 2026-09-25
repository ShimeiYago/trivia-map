import { API_TIMEOUT, BASE_URL } from 'constant';
import { AxiosError } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';

export async function registration(param: {
  nickname: string;
  email: string;
  password1: string;
  password2: string;
}): Promise<void> {
  const axiosInstance = getAxiosInstance({ timeout: API_TIMEOUT.long }, {});

  const requestData: RegistrationRequest = {
    email: param.email,
    nickname: param.nickname,
    password1: param.password1,
    password2: param.password2,
  };

  try {
    await axiosInstance.post(`${BASE_URL}/auths/registration/`, requestData);
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError<ValidationError>(axiosError);
  }
}

export type RegistrationRequest = {
  nickname: string;
  email: string;
  password1: string;
  password2: string;
};

export type ValidationError = {
  email?: string[];
  nickname?: string[];
  password1?: string[];
  password2?: string[];
  non_field_errors?: string[];
};
