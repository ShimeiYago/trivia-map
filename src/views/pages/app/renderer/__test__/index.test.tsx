import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer } from '..';

let wrapper: ShallowWrapper<unknown, unknown, Renderer>;

describe('Shallow Snapshot Tests', () => {
  it('basic', () => {
    wrapper = shallow(<Renderer />);
    expect(wrapper).toMatchSnapshot();
  });
});
