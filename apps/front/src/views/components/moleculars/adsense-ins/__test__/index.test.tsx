import { shallow, ShallowWrapper } from 'enzyme';
import { AdsenseIns } from '..';

let wrapper: ShallowWrapper;

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<AdsenseIns adSlot="xxx" adFormat="auto" />);
  });

  it('basic', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('with optional props', () => {
    wrapper.setProps({
      adLayoutKey: 'xxx',
      fullWidthResponsive: true,
    });
    expect(wrapper.exists()).toBe(true);
  });
});
