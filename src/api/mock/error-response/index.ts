import { AxiosError } from 'axios';

export const axiosMockError = {
  response: {
    status: 500,
    data: {},
  },
  message: 'Intentional API Error with mock',
  config: {
    url: 'https://xxx.com/api',
  },
} as AxiosError;
