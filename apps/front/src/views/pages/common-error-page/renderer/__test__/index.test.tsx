import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer } from '..';

let wrapper: ShallowWrapper;

describe('rendering states', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer errorStatus={500} />);
  });

  it('basic', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('404', () => {
    wrapper.setProps({ errorStatus: 404 });
    expect(wrapper.exists()).toBe(true);
  });
});
