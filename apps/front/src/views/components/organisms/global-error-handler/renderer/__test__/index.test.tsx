import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props, State } from '..';

let wrapper: ShallowWrapper<Props, State, Renderer>;

const basicProps: Props = {
  children: 'children',
  resetErrorStatus: jest.fn(),
};

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('basic', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('redirect to 404', () => {
    wrapper.setState({
      redirectTo: 404,
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('redirect to 500', () => {
    wrapper.setState({
      redirectTo: 500,
    });
    expect(wrapper.exists()).toBe(true);
  });
});

describe('componentDidUpdate', () => {
  it('should set reditectTo state', () => {
    wrapper.setProps({ errorStatus: 404 });
    const instance = wrapper.instance();

    instance['componentDidUpdate'](basicProps);
    expect(instance.state.redirectTo).toBe(404);
  });
});
