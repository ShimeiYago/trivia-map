import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props, State } from '..';
import * as ResetPasswordModule from 'api/auths-api/reset-password-confirm';
import { ApiError } from 'api/utils/handle-axios-error';

let wrapper: ShallowWrapper<unknown, State, Renderer>;

let resetPasswordSpy: jest.SpyInstance;

const basicProps: Props = {
  uid: '1',
  token: 'xxx',
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
        password1: ['password is invalid'],
        password2: ['password is invalid'],
      },
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('success case', () => {
    wrapper.setState({
      loadingState: 'success',
    });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('handleChangeTextField', () => {
  it('should set password1', async () => {
    wrapper = shallow(<Renderer {...basicProps} />);
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
    wrapper = shallow(<Renderer {...basicProps} />);
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

describe('handleSubmit', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    resetPasswordSpy = jest.spyOn(ResetPasswordModule, 'resetPasswordConfirm');
  });

  it('should set loadingState success when api succeed', async () => {
    resetPasswordSpy.mockResolvedValue({});

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleSubmit']();

    expect(instance.state.loadingState).toBe('success');
  });

  it('should set form error when api have validation error', async () => {
    const apiError: ApiError<ResetPasswordModule.ValidationError> = {
      status: 400,
      data: {
        password1: ['password is invalid'],
        password2: ['password is invalid'],
      },
      errorMsg: '400 request is invalid',
    };
    resetPasswordSpy.mockRejectedValue(apiError);

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleSubmit']();

    expect(instance.state.formError).toEqual({
      password1: ['password is invalid'],
      password2: ['password is invalid'],
    });
  });

  it('should set error messages when api have validation error for uid and token', async () => {
    const apiError: ApiError<ResetPasswordModule.ValidationError> = {
      status: 400,
      data: {
        uid: ['invalid'],
        token: ['invalid'],
      },
      errorMsg: '400 request is invalid',
    };
    resetPasswordSpy.mockRejectedValue(apiError);

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleSubmit']();

    expect(instance.state.errorMessages).toEqual(['invalid', 'invalid']);
  });

  it('should set loadingstate error when api fail', async () => {
    resetPasswordSpy.mockRejectedValue(new Error());

    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleSubmit']();

    expect(instance.state.loadingState).toBe('error');
  });
});
