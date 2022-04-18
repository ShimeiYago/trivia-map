import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, Renderer>;

const basicProps: Props = {
  submittingState: 'waiting',
  isFormEditting: false,
  isFormChangedFromLastSaved: false,

  onClose: jest.fn(),
  submitEdittedArticle: jest.fn(),
  submitNewArticle: jest.fn(),
  initialize: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
    wrapper.setState({
      openDialog: true,
    });
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('with padding', () => {
    wrapper.setProps({
      padding: 1,
    });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('handleClick', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('should close when form is not changed', () => {
    const instance = wrapper.instance();
    instance['handleClick']();
    expect(instance.props.onClose).toBeCalled();
  });

  it('should open dialog when form is changed', () => {
    wrapper.setProps({
      isFormChangedFromLastSaved: true,
    });
    const instance = wrapper.instance();
    instance['handleClick']();
    expect(instance.state.openDialog).toBeTruthy();
  });
});

describe('handleSave', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('should call submitNewArticle when no postId', () => {
    const instance = wrapper.instance();
    instance['handleSave']();
    expect(instance.props.submitNewArticle).toBeCalled();
  });

  it('should call submitEdittedArticle when having postId', () => {
    wrapper.setProps({
      postId: 'post-id-000',
    });
    const instance = wrapper.instance();
    instance['handleSave']();
    expect(instance.props.submitEdittedArticle).toBeCalled();
  });
});
