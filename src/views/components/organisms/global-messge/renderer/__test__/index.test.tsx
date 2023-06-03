import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, State, Props } from '..';

let shallowWrapper: ShallowWrapper<Props, State, Renderer>;

const props: Props = {
  loggedOutSuccessfully: false,
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...props} />);
  });

  it('basic', () => {
    expect(shallowWrapper).toMatchSnapshot();
  });
});

describe('componentDidMount', () => {
  it('should change states to show logout success message', () => {
    shallowWrapper = shallow(<Renderer {...props} />);
    shallowWrapper.setProps({ loggedOutSuccessfully: true });
    const instance = shallowWrapper.instance();

    instance['componentDidMount']();
    expect(instance.state.message).toBe('ログアウトしました。');
  });
});

describe('componentDidUpdate', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...props} />);
  });

  it('should change states to show logout success message', () => {
    shallowWrapper.setProps({
      loggedOutSuccessfully: true,
    });
    const instance = shallowWrapper.instance();

    instance.componentDidUpdate({
      ...props,
      loggedOutSuccessfully: false,
    });
    expect(instance.state.message).toBe('ログアウトしました。');
  });
});

describe('handleCloseMessage', () => {
  it('should change show state', () => {
    shallowWrapper = shallow(<Renderer {...props} />);
    shallowWrapper.setState({ show: true });
    const instance = shallowWrapper.instance();

    instance['handleCloseMessage']();
    expect(instance.state.show).toBeFalsy();
  });
});
