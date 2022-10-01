import { BASE_URL } from 'constant';
import { AxiosError } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';

export async function logout(): Promise<void> {
  const axiosInstance = getAxiosInstance({}, {});

  try {
    await axiosInstance.post(`${BASE_URL}/auths/logout`);
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError(axiosError);
  }
}
