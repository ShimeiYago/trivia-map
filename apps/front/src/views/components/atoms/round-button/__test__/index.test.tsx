import { shallow, ShallowWrapper } from 'enzyme';
import { RoundButton, Props } from '..';

let wrapper: ShallowWrapper;

const props: Props = {
  children: 'button',
  onClick: jest.fn(),
};

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<RoundButton {...props} />);
  });

  it('base', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('selected', () => {
    wrapper.setProps({ selected: true });
    expect(wrapper.exists()).toBe(true);
  });
});
