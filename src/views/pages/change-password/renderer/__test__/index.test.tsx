import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, State, Props } from '..';
import * as ChangePasswordModule from 'api/auths-api/change-password';
import { ApiError } from 'api/utils/handle-axios-error';
import { User } from 'types/user';

let wrapper: ShallowWrapper<Props, State, Renderer>;

let changePasswordSpy: jest.SpyInstance;

const props: Props = {
  refreshUser: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...props} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('error case', () => {
    wrapper.setState({
      errorTitle: 'error title',
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

  it('social', () => {
    wrapper.setProps({
      user: {
        isSocialAccount: true,
      } as User,
    });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('handleChangeTextField', () => {
  it('should set password1', async () => {
    wrapper = shallow(<Renderer {...props} />);
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
    wrapper = shallow(<Renderer {...props} />);
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
    changePasswordSpy = jest.spyOn(ChangePasswordModule, 'changePassword');
  });

  it('should set loadingState success when api succeed', async () => {
    changePasswordSpy.mockResolvedValue({});

    wrapper = shallow(<Renderer {...props} />);
    const instance = wrapper.instance();

    await instance['handleSubmit']();

    expect(instance.state.loadingState).toBe('success');
  });

  it('should set form error when api have validation error', async () => {
    const apiError: ApiError<ChangePasswordModule.ValidationError> = {
      status: 400,
      data: {
        new_password1: ['password is invalid'],
        new_password2: ['password is invalid'],
      },
      errorMsg: '400 request is invalid',
    };
    changePasswordSpy.mockRejectedValue(apiError);

    wrapper = shallow(<Renderer {...props} />);
    const instance = wrapper.instance();

    await instance['handleSubmit']();

    expect(instance.state.formError).toEqual({
      password1: ['password is invalid'],
      password2: ['password is invalid'],
    });
  });

  it('should set loadingstate error when api fail', async () => {
    changePasswordSpy.mockRejectedValue(new Error());

    wrapper = shallow(<Renderer {...props} />);
    const instance = wrapper.instance();

    await instance['handleSubmit']();

    expect(instance.state.loadingState).toBe('error');
  });
});
