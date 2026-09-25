import { API_TIMEOUT, BASE_URL } from 'constant';
import { AxiosError } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';

export async function deactivate(): Promise<void> {
  const axiosInstance = getAxiosInstance({ timeout: API_TIMEOUT.long }, {});

  try {
    await axiosInstance.put(`${BASE_URL}/auths/deactivate/`);
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError(axiosError);
  }
}
