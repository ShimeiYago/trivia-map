import { shallow, ShallowWrapper } from 'enzyme';
import { DesignedHead } from '..';

let wrapper: ShallowWrapper;

describe('Shallow Snapshot Tests', () => {
  beforeEach(() => {
    wrapper = shallow(<DesignedHead children="xxx" />);
  });

  it('basic', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('basic', () => {
    wrapper.setProps({
      component: 'h5',
    });
    expect(wrapper).toMatchSnapshot();
  });
});
