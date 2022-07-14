import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props, State } from '..';
import * as LoginModule from 'api/auths-api/login';
import { mockLoginResponse } from 'api/mock/auths-response/login';
import { ApiError } from 'api/utils/handle-axios-error';

let wrapper: ShallowWrapper<Props, State, Renderer>;

let loginSpy: jest.SpyInstance;

const basicProps: Props = {
  logginingInState: 'waiting',
  loginSuccess: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('basic', () => {
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
      logginingInState: 'success',
    });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('handleChangeTextField', () => {
  it('should set email', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    const event = {
      target: {
        value: 'xxx@xxx.com',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    instance['handleChangeTextField']('email')(event);

    expect(instance.state.email).toBe('xxx@xxx.com');
  });

  it('should set password', async () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    const event = {
      target: {
        value: 'xxxxx',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    instance['handleChangeTextField']('password')(event);

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

    wrapper = shallow(<Renderer {...basicProps} />);
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

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleClickLogin']();

    expect(instance.state.formError).toEqual({
      email: ['email is invalid'],
      password: ['password is invalid'],
    });
  });

  it('should set localLoadingState error when api fail', async () => {
    loginSpy.mockRejectedValue(new Error());

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleClickLogin']();

    expect(instance.state.localLoadingState).toBe('error');
  });
});
