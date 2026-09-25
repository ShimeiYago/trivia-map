import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props } from '..';
import * as TwitterAccessTokenModule from 'api/auths-api/twitter-access-token';
import { mockTwitterAccessTokenResponse } from 'api/mock/auths-response/twitter-access-token';

let wrapper: ShallowWrapper<Props, null, Renderer>;

let twitterAccessTokenSpy: jest.SpyInstance;
let windowSpy: jest.SpyInstance;

const basicProps: Props = {
  oauthToken: 'xxxxx',
  oauthVerifier: 'xxxx',
  throwError: jest.fn(),
  loginSuccess: jest.fn(),
  setAccessTokenExpiration: jest.fn(),
  setRefreshTokenExpiration: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
    twitterAccessTokenSpy = jest.spyOn(TwitterAccessTokenModule, 'twitterAccessToken');
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

describe('getTwitterAccessToken', () => {
  const origWindow = { ...window };

  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
    twitterAccessTokenSpy = jest.spyOn(TwitterAccessTokenModule, 'twitterAccessToken');
    windowSpy = jest.spyOn(global, 'window', 'get');
    windowSpy.mockImplementation(() => ({
      ...origWindow,
      opener: { postMessage: jest.fn() },
      close: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should post message to parent window and close self window', async () => {
    twitterAccessTokenSpy.mockResolvedValue(mockTwitterAccessTokenResponse);

    const instance = wrapper.instance();
    await instance['getTwitterAccessToken']();
    expect(instance.props.throwError).not.toBeCalled();
  });

  it('should throw error if failed', async () => {
    twitterAccessTokenSpy.mockRejectedValue({});

    const instance = wrapper.instance();
    await instance['getTwitterAccessToken']();
    expect(instance.props.throwError).toBeCalled();
  });
});
