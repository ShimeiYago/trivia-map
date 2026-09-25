import { shallow, ShallowWrapper } from 'enzyme';
import { CenterSpinner } from '..';

let wrapper: ShallowWrapper;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<CenterSpinner />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
