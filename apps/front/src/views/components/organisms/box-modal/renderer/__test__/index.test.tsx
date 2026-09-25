import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, Renderer>;

const basicProps: Props = {
  open: true,
  onClose: jest.fn(),
  children: 'Test',
  windowHeight: 500,
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('show close button', () => {
    wrapper.setProps({
      showCloseButton: true,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('disable click out of modal', () => {
    wrapper.setProps({
      showCloseButton: true,
      disableClickOutside: true,
    });
    expect(wrapper).toMatchSnapshot();
  });
});
