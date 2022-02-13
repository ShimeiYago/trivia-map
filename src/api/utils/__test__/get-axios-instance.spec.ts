import { getAxiosInstance } from '../get-axios-instance';

describe('getAxiosInstance', () => {
  it('return default AxiosInstance', () => {
    const actual = getAxiosInstance();
    expect(actual.defaults.timeout).toEqual(3000);
  });
});
