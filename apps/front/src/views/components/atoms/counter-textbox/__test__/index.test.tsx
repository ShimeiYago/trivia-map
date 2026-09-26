import { shallow, ShallowWrapper } from 'enzyme';
import { CounterTextbox, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, CounterTextbox>;

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<CounterTextbox />);
  });

  it('basic', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('with props', () => {
    wrapper.setProps({
      value: 'text',
      ariaLabel: 'label',
      disabled: false,
      onChange: jest.fn(),
    });
    expect(wrapper.exists()).toBe(true);
  });
});
