import { shallow, ShallowWrapper } from 'enzyme';
import { Renderer } from '..';

let wrapper: ShallowWrapper;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Renderer errorStatus={500} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('404', () => {
    wrapper.setProps({ errorStatus: 404 });
    expect(wrapper).toMatchSnapshot();
  });

  it('408', () => {
    wrapper.setProps({ errorStatus: 408 });
    expect(wrapper).toMatchSnapshot();
  });
});
