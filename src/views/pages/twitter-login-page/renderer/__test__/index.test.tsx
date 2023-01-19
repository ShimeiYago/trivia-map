import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props } from '..';
import * as TwitterRequestTokenModule from 'api/auths-api/twitter-request-token';

let wrapper: ShallowWrapper<Props, null, Renderer>;

let twitterRequestTokenSpy: jest.SpyInstance;
let windowSpy: jest.SpyInstance;

const basicProps: Props = {
  throwError: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
    twitterRequestTokenSpy = jest.spyOn(TwitterRequestTokenModule, 'twitterRequestToken');
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

describe('goToTwitterAuthenticate', () => {
  const origWindow = { ...window };

  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
    twitterRequestTokenSpy = jest.spyOn(TwitterRequestTokenModule, 'twitterRequestToken');
    windowSpy = jest.spyOn(global, 'window', 'get');
    windowSpy.mockImplementation(() => ({
      ...origWindow,
      location: { href: 'https://xxx.com/xxx' },
    }));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // it('should not call throwError', async () => {
  //   twitterRequestTokenSpy.mockResolvedValue(mockTwitterRequestTokenResponse);

  //   const instance = wrapper.instance();
  //   await instance['goToTwitterAuthenticate']();
  //   expect(instance.props.throwError).not.toBeCalled();
  // });

  it('should throw error if failed', async () => {
    twitterRequestTokenSpy.mockRejectedValue({});

    const instance = wrapper.instance();
    await instance['goToTwitterAuthenticate']();
    expect(instance.props.throwError).toBeCalled();
  });
});
