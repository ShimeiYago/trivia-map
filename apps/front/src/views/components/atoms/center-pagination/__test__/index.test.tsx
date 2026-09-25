import { shallow, ShallowWrapper } from 'enzyme';
import { CenterPagination } from '..';

let wrapper: ShallowWrapper;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<CenterPagination />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
