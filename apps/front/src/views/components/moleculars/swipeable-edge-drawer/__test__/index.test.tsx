import { shallow, ShallowWrapper } from 'enzyme';
import { SwipeableEdgeDrawer, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, SwipeableEdgeDrawer>;

const basicProps: Props = {
  show: true,
  open: true,
  onOpen: jest.fn(),
  onClose: jest.fn(),
  children: 'Test',
  bleedingHeight: 56,
  edgeLabel: 'label',
  heightRatio: 50,
};

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<SwipeableEdgeDrawer {...basicProps} />);
  });

  it('basic', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('with show false', () => {
    wrapper.setProps({ show: false });
    expect(wrapper.exists()).toBe(true);
  });

  it('with closed label', () => {
    wrapper.setProps({
      edgeLabelWhenClosed: 'label-closed',
      open: false,
    });
    expect(wrapper.exists()).toBe(true);
  });
});
