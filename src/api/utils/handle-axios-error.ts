import { AxiosError } from 'axios';

export function handleAxiosError<Data>(axiosError: AxiosError): ApiError<Data> {
  if (axiosError.response) {
    // when API is active but response includes error
    const error: ApiError<Data> = {
      status: axiosError.response.status,
      data: axiosError.response.data,
      errorMsg: axiosError.message,
    };
    return error;
  } else {
    // when API is not active
    const error: ApiError<Data> = {
      status: 500,
      errorMsg: axiosError.message,
    };
    return error;
  }
}

export type ApiError<Data> = {
  status: number;
  data?: Data;
  errorMsg: string;
};
