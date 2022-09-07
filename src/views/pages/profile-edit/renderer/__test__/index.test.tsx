import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props, State } from '..';
import * as UpdateUserInfoModule from 'api/auths-api/update-user-info';
import { mockGetUserInfoResponse } from 'api/mock/auths-response/get-user-info';
import { ApiError } from 'api/utils/handle-axios-error';

let wrapper: ShallowWrapper<Props, State, Renderer>;

let updateUserInfoSpy: jest.SpyInstance;

const basicProps: Props = {
  user: {
    userId: 1,
    email: 'xxx@example.com',
    nickname: 'Axel',
    icon: 'https://...',
  },
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

  it('error case', () => {
    wrapper.setState({
      errorTitle: 'error title',
      errorMessages: ['error1', 'error2'],
      formError: {
        nickname: ['nickname is invalid'],
      },
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

describe('handleChangenickname', () => {
  it('should set nickname', async () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    const event = {
      target: {
        value: 'xxxxx',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    instance['handleChangeNickname'](event);

    expect(instance.state.nickname).toBe('xxxxx');
  });
});

describe('handleSubmit', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    updateUserInfoSpy = jest.spyOn(UpdateUserInfoModule, 'updateUserInfo');
  });

  it('should set loadingState success when api succeed', async () => {
    updateUserInfoSpy.mockResolvedValue(mockGetUserInfoResponse);

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleSubmit']();

    expect(instance.state.loadingState).toBe('success');
  });

  it('should set loadingState success', async () => {
    updateUserInfoSpy.mockResolvedValue(mockGetUserInfoResponse);

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleSubmit']();

    expect(instance.state.loadingState).toBe('success');
  });

  it('should set form error when api have validation error', async () => {
    const apiError: ApiError<UpdateUserInfoModule.ValidationError> = {
      status: 400,
      data: {
        nickname: ['nickname is invalid'],
      },
      errorMsg: '400 request is invalid',
    };
    updateUserInfoSpy.mockRejectedValue(apiError);

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleSubmit']();

    expect(instance.state.formError).toEqual({
      nickname: ['nickname is invalid'],
    });
  });

  it('should set loadingstate error when api fail', async () => {
    updateUserInfoSpy.mockRejectedValue(new Error());

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleSubmit']();

    expect(instance.state.loadingState).toBe('error');
  });
});
