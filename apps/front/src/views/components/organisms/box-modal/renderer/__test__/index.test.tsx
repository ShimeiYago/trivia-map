import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, Renderer>;

const basicProps: Props = {
  open: true,
  onClose: jest.fn(),
  children: 'Test',
  windowHeight: 500,
};

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('basic', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('show close button', () => {
    wrapper.setProps({
      showCloseButton: true,
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('disable click out of modal', () => {
    wrapper.setProps({
      showCloseButton: true,
      disableClickOutside: true,
    });
    expect(wrapper.exists()).toBe(true);
  });
});
