import { shallow, ShallowWrapper } from 'enzyme';
import { CounterTextbox, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, CounterTextbox>;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<CounterTextbox />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('with props', () => {
    wrapper.setProps({
      value: 'text',
      ariaLabel: 'label',
      disabled: false,
      onChange: jest.fn(),
    });
    expect(wrapper).toMatchSnapshot();
  });
});
