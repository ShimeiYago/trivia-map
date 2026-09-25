import { BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { Author } from 'types/author';
import { mockGetAuthorInfoResponse } from 'api/mock/users-response';

export async function getAuthorInfo(userId: number): Promise<Author> {
  const url = `${BASE_URL}/users/${userId}`;

  const axiosInstance = getAxiosInstance({}, mockGetAuthorInfoResponse);

  try {
    const res: AxiosResponse<Author> = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError(axiosError);
  }
}
