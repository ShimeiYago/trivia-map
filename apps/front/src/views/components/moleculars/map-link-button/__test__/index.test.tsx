import { shallow, ShallowWrapper } from 'enzyme';
import { MapLinkButton, Props } from '..';

let wrapper: ShallowWrapper<Props, null, MapLinkButton>;

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<MapLinkButton />);
  });

  it('basic', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('user', () => {
    wrapper.setProps({ userId: 1 });
    expect(wrapper.exists()).toBe(true);
  });

  it('category', () => {
    wrapper.setProps({ categoryId: 1 });
    expect(wrapper.exists()).toBe(true);
  });
});
