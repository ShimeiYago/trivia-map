import { shallow, ShallowWrapper } from 'enzyme';
import { BackToNavi, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, BackToNavi>;

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<BackToNavi text="text" link="#" />);
  });

  it('basic', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
