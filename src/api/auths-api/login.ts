import { BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockLoginResponse } from 'api/mock/auths-response/login';
import { User } from 'types/user';

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const axiosInstance = getAxiosInstance({}, mockLoginResponse);

  const requestData: LoginRequest = {
    email: email,
    password: password,
  };

  try {
    // TODO: Set reasonable timeout
    const res: AxiosResponse<LoginResponse> = await axiosInstance.post(
      `${BASE_URL}/auths/login`,
      requestData,
    );
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError<ValidationError>(axiosError);
  }
}

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  user: User;
};

export type ValidationError = {
  email?: string[];
  password?: string[];
  non_field_errors?: string[];
};
