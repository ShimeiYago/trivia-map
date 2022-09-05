import { mockGuessAreaResponse } from './../mock/guess-area-response/index';
import { BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { Park } from '../../types/park';

export async function guessArea(
  params: GuessAreaParams,
): Promise<GuessAreaResponse> {
  const url = `${BASE_URL}/guess-area?lat=${params.lat}&lng=${params.lng}&park=${params.park}`;

  const axiosInstance = getAxiosInstance({}, mockGuessAreaResponse);

  try {
    const res: AxiosResponse<GuessAreaResponse> = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError(axiosError);
  }
}

type GuessAreaParams = {
  lat: number;
  lng: number;
  park: Park;
};

export type GuessAreaResponse = {
  areaNames: string[];
};
