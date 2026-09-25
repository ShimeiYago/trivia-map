import { shallow, ShallowWrapper } from 'enzyme';
import { TextList, Props } from '..';

let wrapper: ShallowWrapper;

const props: Props = {
  list: ['xxx', 'yyy'],
};

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<TextList {...props} />);
  });

  it('base', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
