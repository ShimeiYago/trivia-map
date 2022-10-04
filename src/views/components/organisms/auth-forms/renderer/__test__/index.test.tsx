import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, Renderer>;

const basicProps: Props = {
  autoLoggingInState: 'waiting',
  initialMode: 'login',
  loginSuccess: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('signup mode', () => {
    wrapper.setState({
      mode: 'signup',
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('reset-pasword mode', () => {
    wrapper.setState({
      mode: 'reset-password',
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('resend-email mode', () => {
    wrapper.setState({
      mode: 'resend-email',
    });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('switchMode', () => {
  it('should provide a handler to change mode', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    instance['switchMode']('signup')();

    expect(instance.state.mode).toBe('signup');
  });
});

describe('handleChangeEmail', () => {
  it('should change email state', () => {
    wrapper = shallow(<Renderer {...basicProps} />);
    const instance = wrapper.instance();

    const inputEvent = {
      target: {
        value: 'xxx@example.com',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    instance['handleChangeEmail'](inputEvent);

    expect(instance.state.email).toBe('xxx@example.com');
  });
});
