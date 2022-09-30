import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, Renderer>;

const basicProps: Props = {
  submittingState: 'waiting',
  isFormEditting: false,
  isFormChangedFromLastSaved: false,

  onClose: jest.fn(),
  submitArticle: jest.fn(),
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

describe('cancelToClose', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
    wrapper.setState({ openDialog: true });
  });

  it('should close dialog', () => {
    const instance = wrapper.instance();
    instance['cancelToClose']();
    expect(instance.state.openDialog).toBeFalsy();
  });
});
