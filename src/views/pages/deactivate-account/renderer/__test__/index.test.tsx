import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props, State } from '..';
import * as DeactivateModule from 'api/auths-api/deactivate';
// import { ApiError } from 'api/utils/handle-axios-error';

let wrapper: ShallowWrapper<Props, State, Renderer>;

let deactivateSpy: jest.SpyInstance;

const basicProps: Props = {
  user: {
    userId: 1,
    email: 'xxx@example.com',
    nickname: 'Axel',
    icon: 'https://...',
    isSocialAccount: false,
  },
  throwError: jest.fn(),
  removeCookie: jest.fn(),
  updateUser: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('loading', () => {
    wrapper.setState({
      loadingState: 'loading',
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('success', () => {
    wrapper.setState({
      loadingState: 'success',
    });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('toggleConfirmModal', () => {
  it('change openComfirmDialog state', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    instance['toggleConfirmModal']();

    expect(instance.state.openComfirmDialog).toBeTruthy();
  });
});

describe('handleDeactivate', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    deactivateSpy = jest.spyOn(DeactivateModule, 'deactivate');
  });

  it('should set loadingState success when api succeed', async () => {
    deactivateSpy.mockResolvedValue({});

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleDeactivate']();

    expect(instance.state.loadingState).toBe('success');
  });

  it('should call throwError error when api fail', async () => {
    deactivateSpy.mockRejectedValue(new Error());

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleDeactivate']();

    expect(instance.props.throwError).toBeCalled();
  });
});
