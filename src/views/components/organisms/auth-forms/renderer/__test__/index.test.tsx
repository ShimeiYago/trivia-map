import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, Renderer>;

const basicProps: Props = {
  logginingInState: 'waiting',
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
    wrapper.setProps({
      initialMode: 'signup',
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
