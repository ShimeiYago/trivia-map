import { shallow, ShallowWrapper } from 'enzyme';
import { ResendEmailForm, Props, State } from '..';
import * as ResendEmailModule from 'api/auths-api/resend-email';
import { ApiError } from 'api/utils/handle-axios-error';

let wrapper: ShallowWrapper<Props, State, ResendEmailForm>;

let loginSpy: jest.SpyInstance;

const basicProps: Props = {
  switchMode: jest.fn(),
  onChangeEmail: jest.fn(),
  email: '',
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<ResendEmailForm {...basicProps} />);
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
    loginSpy = jest.spyOn(ResendEmailModule, 'resendEmail');
  });

  it('should set localLoadingState success when api succeed', async () => {
    loginSpy.mockResolvedValue({});

    wrapper = shallow(<ResendEmailForm {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleSubmit']();

    expect(instance.state.localLoadingState).toBe('success');
  });

  it('should set form error when api have validation error', async () => {
    const apiError: ApiError<ResendEmailModule.ValidationError> = {
      status: 400,
      data: {
        email: ['email is invalid'],
        non_field_errors: ['unknown error'],
      },
      errorMsg: '400 request is invalid',
    };
    loginSpy.mockRejectedValue(apiError);

    wrapper = shallow(<ResendEmailForm {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleSubmit']();

    expect(instance.state.formError).toEqual({
      email: ['email is invalid'],
    });
  });

  it('should set localLoadingState error when api fail', async () => {
    loginSpy.mockRejectedValue(new Error());

    wrapper = shallow(<ResendEmailForm {...basicProps} />);
    const instance = wrapper.instance();

    await instance['handleSubmit']();

    expect(instance.state.localLoadingState).toBe('error');
  });
});
