import { shallow, ShallowWrapper } from 'enzyme';
import { CenterPagination } from '..';

let wrapper: ShallowWrapper;

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<CenterPagination />);
  });

  it('basic', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
