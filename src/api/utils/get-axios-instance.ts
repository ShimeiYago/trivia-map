import { API_TIMEOUT } from './../../constant/index';
import { axiosMockError } from 'api/mock/error-response';
import axios, {
  AxiosAdapter,
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { sleep } from 'utils/sleep';

/**
 * This returns the AxiosInstance for API request.
 * Axios request returns mock data depending on environment variable "REACT_APP_MOCK".
 * If env "REACT_APP_MOCK" is "normal", axios returns mock response data.
 * And if env "REACT_APP_MOCK" is "error", axios throw mock error.
 *
 * @param additionalConfig - The AxiosRequestConfig additionally set to default
 * @param mockData - The expected mock response data
 * @returns The AxiosInstance for API request
 */

export function getAxiosInstance(
  additionalConfig: AxiosRequestConfig = {},
  mockData?: unknown,
): AxiosInstance {
  const axiosRequestConfig: AxiosRequestConfig = {
    ...defaultConfig,
    ...additionalConfig,
  };

  if (mockData) {
    switch (process.env.REACT_APP_MOCK) {
      case 'normal':
        axiosRequestConfig.adapter = getMockAdapter(mockData, 'normal');
        break;
      case 'error':
        axiosRequestConfig.adapter = getMockAdapter(mockData, 'error');
        break;
    }
  }

  return axios.create(axiosRequestConfig);
}

const defaultConfig: AxiosRequestConfig = {
  timeout: API_TIMEOUT.short,
};

function getMockAdapter(mockData: unknown, mode: 'normal' | 'error'): AxiosAdapter {
  return async () => {
    await sleep(Number(process.env.REACT_APP_MOCK_DELAY_TIME));

    return new Promise((resolve, reject) => {
      switch (mode) {
        case 'normal':
          resolve({ data: mockData } as AxiosResponse);
          break;
        case 'error':
          reject(axiosMockError as AxiosError);
          break;
      }
    });
  };
}
