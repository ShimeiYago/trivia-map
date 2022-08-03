import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer } from '..';

let wrapper: ShallowWrapper;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
