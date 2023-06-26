import { AxiosError } from 'axios';
import { sendGa4ExceptionEvent } from 'utils/send-ga4-exception-event';

export function handleAxiosError<Data>(axiosError: AxiosError): ApiError<Data> {
  let error: ApiError<Data>;
  if (axiosError.code === 'ECONNABORTED') {
    // When timeout
    error = {
      status: 408,
      errorMsg: axiosError.message,
    };
  } else if (axiosError.response) {
    // when API is active but response includes error
    error = {
      status: axiosError.response.status,
      data: axiosError.response.data,
      errorMsg: axiosError.message,
    };
  } else {
    // when API is not active
    error = {
      status: 500,
      errorMsg: axiosError.message,
    };
  }

  if (error.status >= 500) {
    sendGa4ExceptionEvent({
      errorCategory: 'api-error',
      apiStatusCode: error.status,
      apiEndpoint: axiosError.config.url,
      message: error.errorMsg,
    });
  }

  return error;
}

export type ApiError<Data> = {
  status: number;
  data?: Data;
  errorMsg: string;
};
