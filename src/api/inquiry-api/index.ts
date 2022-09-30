import { BASE_URL } from 'constant';
import { AxiosError, AxiosResponse } from 'axios';
import { handleAxiosError } from '../utils/handle-axios-error';
import { getAxiosInstance } from 'api/utils/get-axios-instance';
import { mockInquiryResponse } from 'api/mock/inquiry-response';

export async function inquiry(
  request: InquiryRequestAndResponse,
): Promise<InquiryRequestAndResponse> {
  const axiosInstance = getAxiosInstance({}, mockInquiryResponse);

  try {
    // TODO: Set reasonable timeout
    const res: AxiosResponse<InquiryRequestAndResponse> = await axiosInstance.post(
      `${BASE_URL}/inquiry`,
      request,
    );
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw handleAxiosError<ValidationError>(axiosError);
  }
}

export type InquiryRequestAndResponse = {
  email: string;
  tag: string;
  name: string;
  message: string;
};

export type ValidationError = {
  email?: string[];
  name?: string[];
  message?: string[];
};
