import { shallow, ShallowWrapper } from 'enzyme';
import { CenterSpinner } from '..';

let wrapper: ShallowWrapper;

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<CenterSpinner />);
  });

  it('basic', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
