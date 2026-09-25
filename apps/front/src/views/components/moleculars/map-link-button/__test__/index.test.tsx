import { shallow, ShallowWrapper } from 'enzyme';
import { MapLinkButton, Props } from '..';

let wrapper: ShallowWrapper<Props, null, MapLinkButton>;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<MapLinkButton />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('user', () => {
    wrapper.setProps({ userId: 1 });
    expect(wrapper).toMatchSnapshot();
  });

  it('category', () => {
    wrapper.setProps({ categoryId: 1 });
    expect(wrapper).toMatchSnapshot();
  });
});
