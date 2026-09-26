import { shallow, ShallowWrapper } from 'enzyme';
import { HelperText, Props } from '..';

let wrapper: ShallowWrapper<Props>;

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<HelperText>xxx</HelperText>);
  });

  it('basic', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('error', () => {
    wrapper.setProps({
      error: true,
    });
    expect(wrapper.exists()).toBe(true);
  });
});
