import { shallow, ShallowWrapper } from 'enzyme';
import { InternalError } from '..';

let wrapper: ShallowWrapper;

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<InternalError />);
  });

  it('basic', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('timeout', () => {
    wrapper.setProps({ timeout: true });
    expect(wrapper.exists()).toBe(true);
  });
});
