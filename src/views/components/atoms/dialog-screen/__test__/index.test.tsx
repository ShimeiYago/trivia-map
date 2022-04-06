import { shallow, ShallowWrapper } from 'enzyme';
import { DialogScreen, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, DialogScreen>;

const props: Props = {
  children: 'message',
  theme: 'black',
  position: 'top',
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<DialogScreen {...props} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('white theme', () => {
    wrapper.setProps({ theme: 'white' });
    expect(wrapper).toMatchSnapshot();
  });

  it('position bottom', () => {
    wrapper.setProps({ position: 'bottom' });
    expect(wrapper).toMatchSnapshot();
  });
});
