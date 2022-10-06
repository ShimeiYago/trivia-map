import { shallow, ShallowWrapper } from 'enzyme';
import { BoxModal, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, BoxModal>;

const basicProps: Props = {
  open: true,
  onClose: jest.fn(),
  children: 'Test',
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<BoxModal {...basicProps} />);
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
});
