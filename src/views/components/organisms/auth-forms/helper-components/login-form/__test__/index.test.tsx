import { shallow, ShallowWrapper } from 'enzyme';
import { LoginForm, Props, State } from '..';
import * as LoginModule from 'api/auths-api/login';
import { mockLoginResponse } from 'api/mock/auths-response/login';
import { ApiError } from 'api/utils/handle-axios-error';

let wrapper: ShallowWrapper<Props, State, LoginForm>;

let loginSpy: jest.SpyInstance;

const basicProps: Props = {
  autoLoggingInState: 'waiting',
  loginSuccess: jest.fn(),
  switchMode: jest.fn(),
  email: '',
  onChangeEmail: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<LoginForm {...basicProps} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('loading', () => {
    wrapper.setProps({
      autoLoggingInState: 'error',
    });

    wrapper.setState({
      localLoadingState: 'loading',
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('error case', () => {
    wrapper.setState({
      errorTitle: 'error title',
      errorMessages: ['error1', 'error2'],
      formError: {
        email: ['email is invalid'],
        password: ['password is invalid'],
      },
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('already logged in', () => {
    wrapper.setProps({
      autoLoggingInState: 'success',
    });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('handleChangePassword', () => {
  it('should set password', async () => {
    wrapper = shallow(<LoginForm {...basicProps} />);
    const instance = wrapper.instance();

    const event = {
      target: {
        value: 'xxxxx',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    instance['handleChangePassword'](event);

    expect(instance.state.password).toBe('xxxxx');
  });
});

describe('handleClickLogin', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    loginSpy = jest.spyOn(LoginModule, 'login');
  });

  it('should set localLoadingState success when api succeed', async () => {
    loginSpy.mockResolvedValue(mockLoginResponse);

    wrapper = shallow(<LoginForm {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleClickLogin']();

    expect(instance.state.localLoadingState).toBe('success');
  });

  it('should set form error when api have validation error', async () => {
    const apiError: ApiError<LoginModule.ValidationError> = {
      status: 400,
      data: {
        email: ['email is invalid'],
        password: ['password is invalid'],
        non_field_errors: [
          'another error',
          'Must include "email" and "password".',
          'E-mail is not verified.',
        ],
      },
      errorMsg: '400 request is invalid',
    };
    loginSpy.mockRejectedValue(apiError);

    wrapper = shallow(<LoginForm {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleClickLogin']();

    expect(instance.state.formError).toEqual({
      email: ['email is invalid'],
      password: ['password is invalid'],
    });
  });

  it('should set localLoadingState error when api fail', async () => {
    loginSpy.mockRejectedValue(new Error());

    wrapper = shallow(<LoginForm {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleClickLogin']();

    expect(instance.state.localLoadingState).toBe('error');
  });
});
