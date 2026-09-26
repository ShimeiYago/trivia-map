import { shallow, ShallowWrapper } from 'enzyme';
import { CounterButton, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, CounterButton>;

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<CounterButton />);
  });

  it('basic', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('with props', () => {
    wrapper.setProps({
      variant: 'async',
      ariaLabel: 'label',
      children: 'button',
      onClick: jest.fn(),
      disabled: true,
    });
    expect(wrapper.exists()).toBe(true);
  });
});
