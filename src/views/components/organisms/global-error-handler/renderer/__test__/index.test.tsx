import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props, State } from '..';

let wrapper: ShallowWrapper<Props, State, Renderer>;

const basicProps: Props = {
  children: 'children',
  resetErrorStatus: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('redirect to 404', () => {
    wrapper.setState({
      redirectTo: 404,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('redirect to 408', () => {
    wrapper.setState({
      redirectTo: 408,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('redirect to 500', () => {
    wrapper.setState({
      redirectTo: 500,
    });
    expect(wrapper).toMatchSnapshot();
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
