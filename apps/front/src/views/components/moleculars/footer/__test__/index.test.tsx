import { shallow, ShallowWrapper } from 'enzyme';
import { Footer } from '..';

let wrapper: ShallowWrapper;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<Footer isMobile={false} />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('mobile', () => {
    wrapper.setProps({ isMobile: true });
    expect(wrapper).toMatchSnapshot();
  });
});
