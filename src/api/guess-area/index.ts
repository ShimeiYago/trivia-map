import { mockGuessAreaResponse } from './../mock/guess-area-response/index';
import { API_TIMEOUT, BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { Park } from '../../types/park';

export async function guessArea(request: GuessAreaRequest): Promise<GuessAreaResponse> {
  const url = `${BASE_URL}/guess-area`;
  const axiosInstance = getAxiosInstance({ timeout: API_TIMEOUT.long }, mockGuessAreaResponse);

  try {
    const res: AxiosResponse<GuessAreaResponse> = await axiosInstance.post(url, request);
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError(axiosError);
  }
}

type GuessAreaRequest = {
  lat: number;
  lng: number;
  park: Park;
};

export type GuessAreaResponse = {
  areaNames: string[];
};
