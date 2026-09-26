import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, Renderer>;

const basicProps: Props = {
  isMobile: false,
  showSidebar: true,
  children: <div />,
};

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer {...basicProps} />);
  });

  it('basic', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('mobile', () => {
    wrapper.setProps({ isMobile: true });
    expect(wrapper.exists()).toBe(true);
  });

  it('with sidebar', () => {
    wrapper.setProps({ showSidebar: false });
    expect(wrapper.exists()).toBe(true);
  });

  it('hide local navi', () => {
    wrapper.setProps({ hideLocalNavi: true });
    expect(wrapper.exists()).toBe(true);
  });
});
