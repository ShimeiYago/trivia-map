import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props, State } from '..';
import * as TwitterRequestTokenModule from 'api/auths-api/twitter-request-token';
import { mockTwitterRequestTokenResponse } from 'api/mock/auths-response/twitter-request-token';

let wrapper: ShallowWrapper<Props, State, Renderer>;
let twitterRequestTokenSpy: jest.SpyInstance;

const basicProps: Props = {
  redirectTo: jest.fn(),
  throwError: jest.fn(),
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
  const origWindowLocation = window.location;

  beforeEach(() => {
    twitterRequestTokenSpy = jest.spyOn(TwitterRequestTokenModule, 'twitterRequestToken');
  });

  afterEach(() => {
    jest.resetAllMocks();
    window.location = origWindowLocation;
  });

  it('should redirect to authenticateUrl', async () => {
    twitterRequestTokenSpy.mockResolvedValue(mockTwitterRequestTokenResponse);

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleClick']();

    expect(instance.props.redirectTo).toBeCalledWith(
      mockTwitterRequestTokenResponse.authenticateUrl,
    );
  });

  it('should throw error if api is failed', async () => {
    twitterRequestTokenSpy.mockRejectedValue({});

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleClick']();

    expect(instance.props.throwError).toBeCalled();
  });
});
