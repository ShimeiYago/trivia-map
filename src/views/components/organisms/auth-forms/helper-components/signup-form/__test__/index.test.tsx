import { shallow, ShallowWrapper } from 'enzyme';
import { SignupForm, Props, State } from '..';

let wrapper: ShallowWrapper<Props, State, SignupForm>;

const basicProps: Props = {
  logginingInState: 'waiting',
  loginSuccess: jest.fn(),
  switchMode: jest.fn(),
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

  it('already logged in', () => {
    wrapper.setProps({
      logginingInState: 'success',
    });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('handleChangeTextField', () => {
  it('should set email', () => {
    wrapper = shallow(<SignupForm {...basicProps} />);
    const instance = wrapper.instance();

    const event = {
      target: {
        value: 'xxx@xxx.com',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    instance['handleChangeTextField']('email')(event);

    expect(instance.state.email).toBe('xxx@xxx.com');
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
