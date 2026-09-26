import { shallow, ShallowWrapper } from 'enzyme';
import { DialogScreen, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, DialogScreen>;

const props: Props = {
  children: 'message',
  theme: 'black',
  position: 'top',
};

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<DialogScreen {...props} />);
  });

  it('basic', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('white theme', () => {
    wrapper.setProps({ theme: 'white' });
    expect(wrapper.exists()).toBe(true);
  });

  it('position bottom', () => {
    wrapper.setProps({ position: 'bottom' });
    expect(wrapper.exists()).toBe(true);
  });

  it('position freely', () => {
    wrapper.setProps({ position: 50 });
    expect(wrapper.exists()).toBe(true);
  });
});
