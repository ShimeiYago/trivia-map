import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props, State } from '..';
import * as TwitterLoginnModule from 'api/auths-api/twitter-login';
import { mockLoginResponse } from 'api/mock/auths-response/login';
import { mockTwitterAccessTokenResponse } from 'api/mock/auths-response/twitter-access-token';
import { TwitterAccessTokenResponse } from 'api/auths-api/twitter-access-token';

let wrapper: ShallowWrapper<Props, State, Renderer>;
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
    wrapper = shallow(<Renderer {...basicProps} />);
    jest.spyOn(window, 'open').mockResolvedValue({} as never);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should set loading state', async () => {
    const instance = wrapper.instance();
    await instance['handleClick']();

    expect(instance.state.loading).toBeTruthy();
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

  it('should call onLoginSucceed if the prop exist', async () => {
    twitterLoginSpy.mockResolvedValue(mockLoginResponse);
    wrapper.setProps({
      onLoginSucceed: jest.fn(),
    });
    const instance = wrapper.instance();

    await instance['handleMessage'](event);

    expect(instance.props.onLoginSucceed).toBeCalled();
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
