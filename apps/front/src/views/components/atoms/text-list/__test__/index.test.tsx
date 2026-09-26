import { shallow, ShallowWrapper } from 'enzyme';
import { TextList, Props } from '..';

let wrapper: ShallowWrapper;

const props: Props = {
  list: ['xxx', 'yyy'],
};

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<TextList {...props} />);
  });

  it('base', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
