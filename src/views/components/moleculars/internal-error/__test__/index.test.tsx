import { shallow, ShallowWrapper } from 'enzyme';
import { InternalError } from '..';

let wrapper: ShallowWrapper;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<InternalError />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
