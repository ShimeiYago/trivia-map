import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props, State } from '..';
import * as TwitterRequestTokenModule from 'api/auths-api/twitter-request-token';
import { mockTwitterRequestTokenResponse } from 'api/mock/auths-response/twitter-request-token';
import * as TwitterLoginnModule from 'api/auths-api/twitter-login';
import { mockLoginResponse } from 'api/mock/auths-response/login';
import { mockTwitterAccessTokenResponse } from 'api/mock/auths-response/twitter-access-token';
import { TwitterAccessTokenResponse } from 'api/auths-api/twitter-access-token';

let wrapper: ShallowWrapper<Props, State, Renderer>;
let twitterRequestTokenSpy: jest.SpyInstance;
let twitterLoginSpy: jest.SpyInstance;

const basicProps: Props = {
  throwError: jest.fn(),
  loginSuccess: jest.fn(),
  setAccessTokenExpiration: jest.fn(),
  setRefreshTokenExpiration: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

describe('handleClick', () => {
  beforeEach(() => {
    twitterRequestTokenSpy = jest.spyOn(TwitterRequestTokenModule, 'twitterRequestToken');
    wrapper = shallow(<Renderer {...basicProps} />);
    jest.spyOn(window, 'open').mockResolvedValue({} as never);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should open window', async () => {
    twitterRequestTokenSpy.mockResolvedValue(mockTwitterRequestTokenResponse);

    const instance = wrapper.instance();
    await instance['handleClick']();

    expect(instance.props.throwError).not.toBeCalled();
  });

  it('should throw error if api is failed', async () => {
    twitterRequestTokenSpy.mockRejectedValue({});

    const instance = wrapper.instance();

    await instance['handleClick']();

    expect(instance.props.throwError).toBeCalled();
  });
});

describe('componentWillUnmount', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should set null as onmessage', async () => {
    const instance = wrapper.instance();

    instance['componentWillUnmount']();

    expect(window.onmessage).toBeNull();
  });
});

describe('handleMessage', () => {
  const event = {
    data: mockTwitterAccessTokenResponse,
    origin: 'http://localhost',
  } as MessageEvent<TwitterAccessTokenResponse>;

  beforeEach(() => {
    twitterLoginSpy = jest.spyOn(TwitterLoginnModule, 'twitterLogin');
    wrapper = shallow(<Renderer {...basicProps} />);
    wrapper.setState({
      loading: true,
    });

    jest.spyOn(window, 'open').mockResolvedValue({} as never);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should set loading state false', async () => {
    twitterLoginSpy.mockResolvedValue(mockLoginResponse);
    const instance = wrapper.instance();

    await instance['handleMessage'](event);

    expect(instance.state.loading).toBeFalsy();
  });

  it('should throw error if api is failed', async () => {
    twitterLoginSpy.mockRejectedValue({});

    const instance = wrapper.instance();

    await instance['handleMessage'](event);

    expect(instance.props.throwError).toBeCalled();
  });

  it('should return without any process', async () => {
    const event = {
      data: mockTwitterAccessTokenResponse,
      origin: 'xxx',
    } as MessageEvent<TwitterAccessTokenResponse>;

    const instance = wrapper.instance();

    await instance['handleMessage'](event);

    expect(instance.state.loading).toBeTruthy();
  });
});
