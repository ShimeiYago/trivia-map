import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props, State } from '..';
import * as VerifyEmailModule from 'api/auths-api/verify-email';
import { mockLoginResponse } from 'api/mock/auths-response/login';

let wrapper: ShallowWrapper<Props, State, Renderer>;

let loginSpy: jest.SpyInstance;

const basicProps: Props = {
  verifyKey: 'xxxxx',
  throwError: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('success case', () => {
    wrapper.setState({
      loadingState: 'success',
    });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('handleClickVerify', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    loginSpy = jest.spyOn(VerifyEmailModule, 'verifyEmail');
  });

  it('should set localLoadingState success when api succeed', async () => {
    loginSpy.mockResolvedValue(mockLoginResponse);

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleClickVerify']();

    expect(instance.state.loadingState).toBe('success');
  });

  it('should set localLoadingState error when api fail', async () => {
    loginSpy.mockRejectedValue(new Error());

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleClickVerify']();

    expect(instance.props.throwError).toBeCalled();
  });
});
