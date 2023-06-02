import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, State, Props } from '..';

let shallowWrapper: ShallowWrapper<Props, State, Renderer>;

const props: Props = {
  articleFormSubmittingState: 'waiting',
  submitSuccessInfo: { postId: 1, title: 'title', description: 'description' },
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...props} />);
  });

  it('basic', () => {
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('without submitSuccessInfo', () => {
    shallowWrapper.setProps({
      submitSuccessInfo: undefined,
    });
    expect(shallowWrapper).toMatchSnapshot();
  });
});

describe('componentDidUpdate', () => {
  beforeEach(() => {
    shallowWrapper = shallow(<Renderer {...props} />);
  });

  it('should change states to show post success message', () => {
    shallowWrapper.setProps({
      articleFormSubmittingState: 'success',
    });
    const instance = shallowWrapper.instance();

    instance.componentDidUpdate({
      ...props,
      articleFormSubmittingState: 'loading',
    });
    expect(instance.state.show).toBeTruthy();
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
