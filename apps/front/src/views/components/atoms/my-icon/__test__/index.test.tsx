import { shallow, ShallowWrapper } from 'enzyme';
import { MyIcon, Props } from '..';

let wrapper: ShallowWrapper<Props>;

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<MyIcon variant="map-marker" />);
  });

  it('basic', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
