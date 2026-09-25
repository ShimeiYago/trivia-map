import { shallow, ShallowWrapper } from 'enzyme';
import { CounterButton, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, CounterButton>;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<CounterButton />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('with props', () => {
    wrapper.setProps({
      variant: 'async',
      ariaLabel: 'label',
      children: 'button',
      onClick: jest.fn(),
      disabled: true,
    });
    expect(wrapper).toMatchSnapshot();
  });
});
