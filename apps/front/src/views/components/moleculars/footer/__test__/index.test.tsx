import { shallow, ShallowWrapper } from 'enzyme';
import { Footer } from '..';

let wrapper: ShallowWrapper;

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<Footer isMobile={false} />);
  });

  it('basic', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('mobile', () => {
    wrapper.setProps({ isMobile: true });
    expect(wrapper.exists()).toBe(true);
  });
});
