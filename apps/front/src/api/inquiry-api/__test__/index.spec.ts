import { mockInquiryResponse } from './../../mock/inquiry-response/index';
import { ApiError } from 'api/utils/handle-axios-error';
import { inquiry, InquiryRequestAndResponse } from '../';

const inquiryRequest: InquiryRequestAndResponse = {
  email: 'xxx@xxx.com',
  tag: 'bug-report',
  name: 'name',
  message: 'message',
};

describe('inquiry', () => {
  beforeEach(() => {
    process.env.REACT_APP_MOCK = '';
  });
  afterEach(() => {
    process.env.REACT_APP_MOCK = '';
  });

  it('handle normal response', async () => {
    process.env.REACT_APP_MOCK = 'normal';

    const response = await inquiry(inquiryRequest);
    expect(response).toEqual(mockInquiryResponse);
  });

  it('handle error response', async () => {
    process.env.REACT_APP_MOCK = 'error';

    const expectedApiError: ApiError<unknown> = {
      status: 500,
      data: {},
      errorMsg: 'Intentional API Error with mock',
    };
    await expect(inquiry(inquiryRequest)).rejects.toEqual(expectedApiError);
  });
});
