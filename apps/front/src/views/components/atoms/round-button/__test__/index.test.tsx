import { shallow, ShallowWrapper } from 'enzyme';
import { RoundButton, Props } from '..';

let wrapper: ShallowWrapper;

const props: Props = {
  children: 'button',
  onClick: jest.fn(),
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<RoundButton {...props} />);
  });

  it('base', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('selected', () => {
    wrapper.setProps({ selected: true });
    expect(wrapper).toMatchSnapshot();
  });
});
