import { shallow, ShallowWrapper } from 'enzyme';
import { PasswordResetRequestForm, Props, State } from '..';
import * as ResetPsswordModule from 'api/auths-api/reset-password';
import { mockLoginResponse } from 'api/mock/auths-response/login';
import { ApiError } from 'api/utils/handle-axios-error';

let wrapper: ShallowWrapper<Props, State, PasswordResetRequestForm>;

let loginSpy: jest.SpyInstance;

const basicProps: Props = {
  switchMode: jest.fn(),
  email: '',
  onChangeEmail: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<PasswordResetRequestForm {...basicProps} />);
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

describe('handleSubmit', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    loginSpy = jest.spyOn(ResetPsswordModule, 'resetPassword');
  });

  it('should set localLoadingState success when api succeed', async () => {
    loginSpy.mockResolvedValue(mockLoginResponse);

    wrapper = shallow(<PasswordResetRequestForm {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleSubmit']();

    expect(instance.state.localLoadingState).toBe('success');
  });

  it('should set form error when api have validation error', async () => {
    const apiError: ApiError<ResetPsswordModule.ValidationError> = {
      status: 400,
      data: {
        email: ['email is invalid'],
      },
      errorMsg: '400 request is invalid',
    };
    loginSpy.mockRejectedValue(apiError);

    wrapper = shallow(<PasswordResetRequestForm {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleSubmit']();

    expect(instance.state.formError).toEqual({
      email: ['email is invalid'],
    });
  });

  it('should set localLoadingState error when api fail', async () => {
    loginSpy.mockRejectedValue(new Error());

    wrapper = shallow(<PasswordResetRequestForm {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleSubmit']();

    expect(instance.state.localLoadingState).toBe('error');
  });
});
