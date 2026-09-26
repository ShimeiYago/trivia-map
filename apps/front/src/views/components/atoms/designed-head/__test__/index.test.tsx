import { shallow, ShallowWrapper } from 'enzyme';
import { DesignedHead } from '..';

let wrapper: ShallowWrapper;

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<DesignedHead children="xxx" />);
  });

  it('basic', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('basic', () => {
    wrapper.setProps({
      component: 'h5',
    });
    expect(wrapper.exists()).toBe(true);
  });
});
