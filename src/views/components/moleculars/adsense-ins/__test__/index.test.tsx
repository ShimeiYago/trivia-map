import { shallow, ShallowWrapper } from 'enzyme';
import { AdsenseIns } from '..';

let wrapper: ShallowWrapper;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<AdsenseIns adSlot="xxx" adFormat="auto" />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('with optional props', () => {
    wrapper.setProps({
      adLayoutKey: 'xxx',
      fullWidthResponsive: true,
    });
    expect(wrapper).toMatchSnapshot();
  });
});
