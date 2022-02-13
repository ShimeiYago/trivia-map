import { AxiosError } from 'axios';

export function handleAxiosError(axiosError: AxiosError): ApiError {
  if (axiosError.response) {
    // when API is active but response includes error
    const error: ApiError = {
      status: axiosError.response.status,
      data: axiosError.response.data,
      errorMsg: axiosError.message,
    };
    return error;
  } else {
    // when API is not active
    const error: ApiError = {
      status: 500,
      data: {},
      errorMsg: axiosError.message,
    };
    return error;
  }
}

export type ApiError = {
  status: number;
  data: unknown;
  errorMsg: string;
};
