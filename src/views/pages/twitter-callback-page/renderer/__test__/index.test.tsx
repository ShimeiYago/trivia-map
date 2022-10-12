import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props, State } from '..';
import * as TwitterAccessTokenModule from 'api/auths-api/twitter-access-token';
import * as TwitterLoginModule from 'api/auths-api/twitter-login';
import { mockTwitterAccessTokenResponse } from 'api/mock/auths-response/twitter-access-token';
import { mockLoginResponse } from 'api/mock/auths-response/login';

let wrapper: ShallowWrapper<Props, State, Renderer>;

let twitterAccessTokenSpy: jest.SpyInstance;
let twitterLoginSpy: jest.SpyInstance;

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
    twitterLoginSpy = jest.spyOn(TwitterLoginModule, 'twitterLogin');
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('redirect', () => {
    wrapper.setState({
      redirect: true,
    });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('twitterLogin', () => {
  it('should change redirect state if scceed', async () => {
    twitterAccessTokenSpy.mockResolvedValue(mockTwitterAccessTokenResponse);
    twitterLoginSpy.mockResolvedValue(mockLoginResponse);

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();
    await instance['twitterLogin']();
    expect(instance.state.redirect).toBeTruthy();
  });

  it('should throw error if failed', async () => {
    twitterAccessTokenSpy.mockResolvedValue(mockTwitterAccessTokenResponse);
    twitterLoginSpy.mockRejectedValue({});

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();
    await instance['twitterLogin']();
    expect(instance.props.throwError).toBeCalled();
  });
});
