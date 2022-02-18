import { AxiosError } from 'axios';
import { handleAxiosError } from '../handle-axios-error';

type ValidationError = {
  headerErrors: string[];
  fieldErrors?: {
    title?: string[];
    content?: string[];
  };
};
const validationError: ValidationError = {
  headerErrors: ['an error in title.'],
  fieldErrors: { title: ['title is too long.'] },
};

describe('handleAxiosError', () => {
  it('convert axiosError when API is active but response includes error', () => {
    const axiosError: AxiosError = {
      response: {
        status: 409,
        data: validationError,
        config: {},
        statusText: '',
        headers: {},
      },
      message: 'validation error',
      isAxiosError: true,
      toJSON: () => jest.fn(),
      config: {},
      name: '',
    };
    const actual = handleAxiosError<ValidationError>(axiosError);
    const expected = {
      status: 409,
      data: validationError,
      errorMsg: 'validation error',
    };
    expect(actual).toEqual(expected);
  });

  it('convert axiosError when API is not active', () => {
    const axiosError: AxiosError = {
      message: 'API error',
      isAxiosError: true,
      toJSON: () => jest.fn(),
      config: {},
      name: '',
    };
    const actual = handleAxiosError(axiosError);
    const expected = {
      status: 500,
      errorMsg: 'API error',
    };
    expect(actual).toEqual(expected);
  });
});
