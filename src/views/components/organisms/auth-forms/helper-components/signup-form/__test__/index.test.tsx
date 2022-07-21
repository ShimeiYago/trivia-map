import { shallow, ShallowWrapper } from 'enzyme';
import { SignupForm, Props, State } from '..';
import * as RegistrationModule from 'api/auths-api/registration';
import { ApiError } from 'api/utils/handle-axios-error';

let wrapper: ShallowWrapper<Props, State, SignupForm>;

let loginSpy: jest.SpyInstance;

const basicProps: Props = {
  switchMode: jest.fn(),
  email: '',
  onChangeEmail: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<SignupForm {...basicProps} />);
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
        password1: ['password is invalid'],
        password2: ['password is invalid'],
      },
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('success case', () => {
    wrapper.setState({
      localLoadingState: 'success',
    });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('handleChangeTextField', () => {
  it('should set nickname', async () => {
    wrapper = shallow(<SignupForm {...basicProps} />);
    const instance = wrapper.instance();

    const event = {
      target: {
        value: 'xxxxx',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    instance['handleChangeTextField']('nickname')(event);

    expect(instance.state.nickname).toBe('xxxxx');
  });

  it('should set password1', async () => {
    wrapper = shallow(<SignupForm {...basicProps} />);
    const instance = wrapper.instance();

    const event = {
      target: {
        value: 'xxxxx',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    instance['handleChangeTextField']('password1')(event);

    expect(instance.state.password1).toBe('xxxxx');
  });

  it('should set password2', async () => {
    wrapper = shallow(<SignupForm {...basicProps} />);
    const instance = wrapper.instance();

    const event = {
      target: {
        value: 'xxxxx',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    instance['handleChangeTextField']('password2')(event);

    expect(instance.state.password2).toBe('xxxxx');
  });
});

describe('handleClickSignup', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    loginSpy = jest.spyOn(RegistrationModule, 'registration');
  });

  it('should set localLoadingState success when api succeed', async () => {
    loginSpy.mockResolvedValue({});

    wrapper = shallow(<SignupForm {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleClickSignup']();

    expect(instance.state.localLoadingState).toBe('success');
  });

  it('should set form error when api have validation error', async () => {
    const apiError: ApiError<RegistrationModule.ValidationError> = {
      status: 400,
      data: {
        email: ['email is invalid'],
        nickname: ['nickname is invalid'],
        password1: ['password is invalid'],
        password2: ['password is invalid'],
        non_field_errors: [
          'another error',
          "The two password fields didn't match.",
        ],
      },
      errorMsg: '400 request is invalid',
    };
    loginSpy.mockRejectedValue(apiError);

    wrapper = shallow(<SignupForm {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleClickSignup']();

    expect(instance.state.formError).toEqual({
      email: ['email is invalid'],
      nickname: ['nickname is invalid'],
      password1: ['password is invalid'],
      password2: ['password is invalid'],
    });
  });

  it('should set localLoadingState error when api fail', async () => {
    loginSpy.mockRejectedValue(new Error());

    wrapper = shallow(<SignupForm {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleClickSignup']();

    expect(instance.state.localLoadingState).toBe('error');
  });
});
