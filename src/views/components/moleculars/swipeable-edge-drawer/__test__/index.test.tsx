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
  labelText: 'label',
  heightRatio: 50,
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<SwipeableEdgeDrawer {...basicProps} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('with show false', () => {
    wrapper.setProps({ show: false });
    expect(wrapper).toMatchSnapshot();
  });
});
