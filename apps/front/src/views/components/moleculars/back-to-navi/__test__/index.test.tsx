import { shallow, ShallowWrapper } from 'enzyme';
import { BackToNavi, Props } from '..';

let wrapper: ShallowWrapper<Props, unknown, BackToNavi>;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<BackToNavi text="text" link="#" />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
