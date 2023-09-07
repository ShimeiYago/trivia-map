/* istanbul ignore file */

import { BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';

export async function deleteSpecialMapMarker(specialMapMarkerId: number): Promise<unknown> {
  const axiosInstance = getAxiosInstance({}, {});

  try {
    const res: AxiosResponse<unknown> = await axiosInstance.delete(
      `${BASE_URL}/special-map/markers/${specialMapMarkerId}`,
    );
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError(axiosError);
  }
}
